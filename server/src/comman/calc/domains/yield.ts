import { FormulaDefinition } from '../types';

export const yieldFormulas: Record<string, FormulaDefinition> = {
  yieldEst: {
    type: 'DERIVED',
    calculate: (data) => {
      const crushed = Number(data.totalCaneCrushed) || 0;
      const bagged = Number(data.totalSugarBagged) || 0;
      if (crushed === 0) return 0;
      return Number(((bagged / crushed) * 100).toFixed(2));
    },
  },
};
