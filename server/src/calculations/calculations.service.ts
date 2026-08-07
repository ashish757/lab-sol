import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormulaRegistry } from '../comman/calc/formulas';
import { TimeMetric } from '../comman/calc/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalculationsService {
  private readonly logger = new Logger(CalculationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Evaluates ALL formulas in the registry recursively.
   * @param rawData The raw input payload for the day.
   * @param preCalculated Overrides for DFS (used to pass toMonth/toDate sums into derived calculations).
   */
  public evaluateFormulas(
    rawData: Record<string, any>, 
    preCalculated: Record<string, any> = {}
  ): Record<string, any> {
    const cache: Record<string, any> = {};
    const visited = new Set<string>();

    const dfsEvaluate = (prop: string): any => {
      // 1. Check cache first
      if (cache.hasOwnProperty(prop)) return cache[prop];
      
      // 2. Prevent Circular Dependencies
      if (visited.has(prop)) {
        this.logger.error(`Circular Dependency detected for formula: ${prop}`);
        throw new BadRequestException(`Circular Dependency detected for formula: ${prop}`);
      }

      // 3. Use Pre-Calculated Overrides (CRITICAL for toMonth/toDate derived formulas)
      if (preCalculated.hasOwnProperty(prop)) {
        cache[prop] = preCalculated[prop];
        return preCalculated[prop];
      }

      visited.add(prop);

      let result;
      if (FormulaRegistry[prop]) {
          // Create a Proxy around an empty object to intercept gets
          const proxy = new Proxy({}, {
            get: (target, key: string | symbol) => {
              if (typeof key === 'symbol') return Reflect.get(target, key);
              if (['hasOwnProperty', 'toString', 'valueOf', 'constructor'].includes(key)) {
                return Reflect.get(target, key);
              }
              
              // THE FIX: If a formula asks for its own exact name, bypass the evaluation 
              // and hand it the raw input data (or pre-calculated sum) directly!
              if (key === prop) {
                return preCalculated.hasOwnProperty(key as string) 
                  ? preCalculated[key as string] 
                  : rawData[key as string];
              }
              
              // Recursively evaluate the dependency
              return dfsEvaluate(key as string);
            }
          });
          
          try {
            result = FormulaRegistry[prop].calculate(proxy);
          } catch (error: any) {
            if (error.name === 'BadRequestException' || error.message.includes('Circular')) {
              throw error; // Re-throw circular dependency exceptions
            }
            // Cannot use this.logger here directly if it's a nested function without context, but we are inside evaluateFormulas so we can if we bind it. 
            // We'll just set it to null.
            result = null; // Fail explicitly instead of silent 0
          }
        } else {
        // Base case: it's a raw data point
        result = rawData[prop];
      }

      visited.delete(prop);
      cache[prop] = result;
      return result;
    };

    // Evaluate EVERYTHING in the registry to maintain the snapshot integrity
    const allFormulaIds = Object.keys(FormulaRegistry);
    for (const id of allFormulaIds) {
      dfsEvaluate(id);
    }

    return cache;
  }

  /**
   * Master execution pipeline: evaluates formulas and upserts the DailyCalculation record.
   */
  async processCalculations(dailyLogId: string, payload: Record<string, any>) {
    const currentLog = await this.prisma.dailyLog.findUnique({
      where: { id: dailyLogId },
    });

    if (!currentLog) {
      this.logger.warn(`DailyLog ${dailyLogId} not found, aborting calculations.`);
      return null;
    }

    // 1. Fetch Snapshot (Yesterday's Calculation)
    const yesterdayLog = await this.prisma.dailyLog.findFirst({
      where: {
        unitId: currentLog.unitId,
        sessionDataId: currentLog.sessionDataId,
        createdAt: { lt: currentLog.createdAt },
      },
      orderBy: { createdAt: 'desc' },
      include: { calculation: true },
    });

    let yesterdayMetrics: Record<string, TimeMetric> = {};
    if (yesterdayLog?.calculation?.calculatedMetrics) {
      yesterdayMetrics = typeof yesterdayLog.calculation.calculatedMetrics === 'string'
        ? JSON.parse(yesterdayLog.calculation.calculatedMetrics)
        : yesterdayLog.calculation.calculatedMetrics;
    }

    // 2. Check Temporal Boundaries
    const currentDate = new Date(currentLog.createdAt);
    const isFirstOfMonth = currentDate.getUTCDate() === 1;
    const isFirstOfSeason = !yesterdayLog;

    // 3. Pass 1: Calculate onDate values using today's payload
    const onDateMetrics = this.evaluateFormulas(payload);

    const calculatedMetrics: Record<string, TimeMetric> = {};
    const toMonthSums: Record<string, any> = {};
    const toDateSums: Record<string, any> = {};

    const allFormulaIds = Object.keys(FormulaRegistry);

    // 4. Pass 2: Additive Aggregation
    for (const id of allFormulaIds) {
      const formulaDef = FormulaRegistry[id];
      const onDateVal = Number(onDateMetrics[id]) || 0;

      if (formulaDef.type === 'ADDITIVE') {
        const toMonth = isFirstOfMonth ? onDateVal : onDateVal + (Number(yesterdayMetrics[id]?.toMonth) || 0);
        const toDate = isFirstOfSeason ? onDateVal : onDateVal + (Number(yesterdayMetrics[id]?.toDate) || 0);

        calculatedMetrics[id] = {
          onDate: onDateVal,
          toMonth,
          toDate,
        };

        // Store these sums to feed into the Derived calculation context
        toMonthSums[id] = toMonth;
        toDateSums[id] = toDate;
      }
    }

    // 5. Pass 3: Derived Aggregation
    // Feed the additive sums as 'preCalculated' overrides so derived formulas use the aggregated data
    const toMonthDerivedMetrics = this.evaluateFormulas(payload, toMonthSums);
    const toDateDerivedMetrics = this.evaluateFormulas(payload, toDateSums);

    for (const id of allFormulaIds) {
      const formulaDef = FormulaRegistry[id];
      
      if (formulaDef.type === 'DERIVED') {
        calculatedMetrics[id] = {
          onDate: Number(onDateMetrics[id]) || 0,
          toMonth: Number(toMonthDerivedMetrics[id]) || 0,
          toDate: Number(toDateDerivedMetrics[id]) || 0,
        };
      }
    }

    // 6. Upsert the DailyCalculation record
    const record = await this.prisma.dailyCalculation.upsert({
      where: { dailyLogId },
      update: {
        calculatedMetrics: calculatedMetrics as unknown as Prisma.InputJsonValue,
      },
      create: {
        dailyLogId,
        calculatedMetrics: calculatedMetrics as unknown as Prisma.InputJsonValue,
      },
    });

    this.logger.log(`Calculations processed successfully for log ${dailyLogId}`);
    return record;
  }
}