import { FormulaDefinition } from '../types';

export const caneFormulas: Record<string, FormulaDefinition> = {
  totalCaneCrushed: {
    type: 'ADDITIVE',
    calculate: (data) => {
      const gate = Number(data.gate) || 0;
      const road = Number(data.road) || 0;
      return gate + road;
    },
  },
};
