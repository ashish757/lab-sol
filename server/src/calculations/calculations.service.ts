import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormulaRegistry, requiredFormulaIds } from '../comman/calc/formulas';
import { TimeMetric } from '../comman/calc/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalculationsService {
  private readonly logger = new Logger(CalculationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Evaluates formulas recursively using a DFS approach with a Proxy to detect dependencies automatically.
   */
  public evaluateFormulas(rawData: Record<string, any>, targetFormulaIds: string[] = requiredFormulaIds): Record<string, any> {
    const cache: Record<string, any> = {};
    const visited = new Set<string>();

    const dfsEvaluate = (prop: string): any => {
      if (cache.hasOwnProperty(prop)) return cache[prop];
      if (visited.has(prop)) {
        this.logger.error(`Circular Dependency detected for formula: ${prop}`);
        throw new BadRequestException(`Circular Dependency detected for formula: ${prop}`);
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
            
            // Recursively evaluate the dependency
            return dfsEvaluate(key);
          }
        });
        
        try {
          result = FormulaRegistry[prop].calculate(proxy);
        } catch (error: any) {
          if (error instanceof BadRequestException) {
            throw error; // Re-throw circular dependency exceptions
          }
          this.logger.warn(`Error evaluating ${prop}: ${error?.message || error}`);
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

    // Trigger evaluation for all requested targets
    for (const id of targetFormulaIds) {
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

    const yesterdayMetrics = yesterdayLog?.calculation?.calculatedMetrics as Record<string, TimeMetric> || {};

    // 2. Check Temporal Boundaries
    const currentDate = new Date(currentLog.createdAt);
    const isFirstOfMonth = currentDate.getUTCDate() === 1;
    const isFirstOfSeason = !yesterdayLog;

    // 3. Pass 1: Calculate onDate values using today's payload
    const onDateMetrics = this.evaluateFormulas(payload);

    const calculatedMetrics: Record<string, TimeMetric> = {};

    // 4. Pass 2: Additive Aggregation
    for (const id of requiredFormulaIds) {
      const formulaDef = FormulaRegistry[id];
      if (!formulaDef) continue;

      const onDateVal = Number(onDateMetrics[id]) || 0;

      if (formulaDef.type === 'ADDITIVE') {
        const toMonth = isFirstOfMonth ? onDateVal : onDateVal + (Number(yesterdayMetrics[id]?.toMonth) || 0);
        const toDate = isFirstOfSeason ? onDateVal : onDateVal + (Number(yesterdayMetrics[id]?.toDate) || 0);

        calculatedMetrics[id] = {
          onDate: onDateVal,
          toMonth,
          toDate,
        };
      }
    }

    // 5. Pass 3: Derived Aggregation
    // We need to feed the aggregated Additive metrics back into the evaluation engine for Derived metrics.
    // Build context objects that contain both the raw payload (for any raw values needed) AND the aggregated additive values.
    const toMonthContext = { ...payload };
    const toDateContext = { ...payload };

    for (const id of requiredFormulaIds) {
      if (calculatedMetrics[id]) {
        toMonthContext[id] = calculatedMetrics[id].toMonth;
        toDateContext[id] = calculatedMetrics[id].toDate;
      }
    }

    const toMonthDerivedMetrics = this.evaluateFormulas(toMonthContext);
    const toDateDerivedMetrics = this.evaluateFormulas(toDateContext);

    for (const id of requiredFormulaIds) {
      const formulaDef = FormulaRegistry[id];
      if (formulaDef && formulaDef.type === 'DERIVED') {
        calculatedMetrics[id] = {
          onDate: Number(onDateMetrics[id]) || 0,
          toMonth: Number(toMonthDerivedMetrics[id]) || 0,
          toDate: Number(toDateDerivedMetrics[id]) || 0,
        };
      }
    }

    // 6. Use Prisma to insert or update the DailyCalculation record
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
