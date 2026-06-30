import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormulaRegistry, requiredFormulaIds } from '../comman/calc/formulas';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalculationsService {
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
          result = FormulaRegistry[prop](proxy);
        } catch (error) {
          if (error instanceof BadRequestException) {
            throw error; // Re-throw circular dependency exceptions
          }
          console.error(`Error evaluating ${prop}:`, error);
          result = 0; // Resilience: return 0 if formula throws
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
    // 1. Trigger calculation engine
    const calculatedMetrics = this.evaluateFormulas(payload);

    // 2. Use Prisma to insert or update the DailyCalculation record
    const record = await this.prisma.dailyCalculation.upsert({
      where: { dailyLogId },
      update: {
        calculatedMetrics: calculatedMetrics as Prisma.InputJsonValue,
      },
      create: {
        dailyLogId,
        calculatedMetrics: calculatedMetrics as Prisma.InputJsonValue,
      },
    });

    return record;
  }
}
