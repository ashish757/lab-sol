import { FormulaDefinition } from '../types';

export const sugarProductionFormulas: Record<string, FormulaDefinition> = {
  // --- Raw Data Pass-Throughs (Additive) ---
  l31: { type: 'ADDITIVE', calculate: (data) => Number(data.l31) || 0 },
  m31: { type: 'ADDITIVE', calculate: (data) => Number(data.m31) || 0 },
  s31: { type: 'ADDITIVE', calculate: (data) => Number(data.s31) || 0 },
  l30: { type: 'ADDITIVE', calculate: (data) => Number(data.l30) || 0 },
  m30: { type: 'ADDITIVE', calculate: (data) => Number(data.m30) || 0 },
  s30: { type: 'ADDITIVE', calculate: (data) => Number(data.s30) || 0 },
  sSs31Export: { type: 'ADDITIVE', calculate: (data) => Number(data.sSs31Export) || 0 },
  rawSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.rawSugar) || 0 },
  llBold: { type: 'ADDITIVE', calculate: (data) => Number(data.llBold) || 0 },
  brownSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.brownSugar) || 0 },
  ScrapingSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.ScrapingSugar) || 0 },

  // --- Calculated Total ---
  totalSugarBagged: {
    type: 'ADDITIVE',
    calculate: (data) => {
      return (
        (Number(data.l31) || 0) +
        (Number(data.m31) || 0) +
        (Number(data.s31) || 0) +
        (Number(data.l30) || 0) +
        (Number(data.m30) || 0) +
        (Number(data.s30) || 0) +
        (Number(data.sSs31Export) || 0) +
        (Number(data.rawSugar) || 0) +
        (Number(data.llBold) || 0) +
        (Number(data.brownSugar) || 0) +
        (Number(data.ScrapingSugar) || 0)
      );
    },
  },

  // --- Sugar Reprocess Pass-Throughs ---
  RemaltingWhiteSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.RemaltingWhiteSugar) || 0 },
  reprocessBrownSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.reprocessBrownSugar) || 0 },
  reprocessRawSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.reprocessRawSugar) || 0 },
  reprocessScrapSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.reprocessScrapSugar) || 0 },
};