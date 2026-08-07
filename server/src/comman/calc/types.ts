export type TimeMetric = {
  onDate: number;
  toMonth: number;
  toDate: number;
};

export type AggregationType = 'ADDITIVE' | 'DERIVED';

export type FormulaFunction = (data: Record<string, any>) => number;

export interface FormulaDefinition {
  type: AggregationType;
  calculate: FormulaFunction;
}
