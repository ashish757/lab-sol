import { FormulaDefinition } from '../types';

export const purityFormulas: Record<string, FormulaDefinition> = {
  primaryJuicePurity: {
    type: 'DERIVED',
    calculate: (data) => {
      const brix = Number(data.primaryJuiceBrix) || 0;
      const pol = Number(data.primaryJuicePol) || 0;
      if (brix === 0) return 0;
      return Number(((pol / brix) * 100).toFixed(2));
    },
  },
  mixedJuicePurity: {
    type: 'DERIVED',
    calculate: (data) => {
      const brix = Number(data.mixedJuiceBrix) || 0;
      const pol = Number(data.mixedJuicePol) || 0;
      if (brix === 0) return 0;
      return Number(((pol / brix) * 100).toFixed(2));
    },
  },
};
