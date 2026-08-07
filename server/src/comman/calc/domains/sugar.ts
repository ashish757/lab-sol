import { FormulaDefinition } from '../types';

export const sugarFormulas: Record<string, FormulaDefinition> = {
  totalSugarBagged: {
    type: 'ADDITIVE',
    calculate: (data) => {
      const raw = Number(data.rawSugar) || 0;
      const llBold = Number(data.llBold) || 0;
      const brown = Number(data.brownSugar) || 0;
      const s31 = Number(data.s31) || 0;
      const m31 = Number(data.m31) || 0;
      const l31 = Number(data.l31) || 0;
      const export31 = Number(data.sSs31Export) || 0;
      return raw + llBold + brown + s31 + m31 + l31 + export31;
    },
  },
};
