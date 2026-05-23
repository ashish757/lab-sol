import { FormulaRegistry } from "./formulas";

export function calculateReportData(
  rawData: Record<string, any>,
  calculationOrder: string[]
): Record<string, any> {
  const accumulatedData = JSON.parse(JSON.stringify(rawData));

  for (const id of calculationOrder) {
    if (id in FormulaRegistry) {
      try {
        accumulatedData[id] = FormulaRegistry[id](accumulatedData);
      } catch (error) {
      }
    }
  }

  return accumulatedData;
}
