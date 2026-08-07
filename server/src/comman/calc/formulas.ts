import { FormulaDefinition } from './types';
import { caneFormulas } from './domains/cane';
import { sugarFormulas } from './domains/sugar';
import { purityFormulas } from './domains/purity';
import { yieldFormulas } from './domains/yield';

export const requiredFormulaIds: string[] = [
  'totalCaneCrushed',
  'totalSugarBagged',
  'primaryJuicePurity',
  'mixedJuicePurity',
  'yieldEst',
];

export const FormulaRegistry: Record<string, FormulaDefinition> = {
  ...caneFormulas,
  ...sugarFormulas,
  ...purityFormulas,
  ...yieldFormulas,
};
