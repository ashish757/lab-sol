import { FormulaDefinition } from '../types';

export const sugarProductionFormulas: Record<string, FormulaDefinition> = {
  // --- Raw Data Pass-Throughs (Additive) ---
  l31: { label: "L31", type: 'ADDITIVE', calculate: (data) => Number(data.l31) || 0 },
  m31: { label: "M31", type: 'ADDITIVE', calculate: (data) => Number(data.m31) || 0 },
  s31: { label: "S31", type: 'ADDITIVE', calculate: (data) => Number(data.s31) || 0 },
  l30: { label: "L30", type: 'ADDITIVE', calculate: (data) => Number(data.l30) || 0 },
  m30: { label: "M30", type: 'ADDITIVE', calculate: (data) => Number(data.m30) || 0 },
  s30: { label: "S30", type: 'ADDITIVE', calculate: (data) => Number(data.s30) || 0 },
  sSs31Export: { label: "S Ss31Export", type: 'ADDITIVE', calculate: (data) => Number(data.sSs31Export) || 0 },
  rawSugar: { label: "Raw Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.rawSugar) || 0 },
  llBold: { label: "Ll Bold", type: 'ADDITIVE', calculate: (data) => Number(data.llBold) || 0 },
  brownSugar: { label: "Brown Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.brownSugar) || 0 },
  ScrapingSugar: { label: "Scraping Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.ScrapingSugar) || 0 },

  // --- Calculated Total ---
  totalSugarBagged: {
    label: "Total Sugar Bagged", type: 'ADDITIVE',
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
  RemaltingWhiteSugar: { label: "Remalting White Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.RemaltingWhiteSugar) || 0 },
  reprocessBrownSugar: { label: "Reprocess Brown Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.reprocessBrownSugar) || 0 },
  reprocessRawSugar: { label: "Reprocess Raw Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.reprocessRawSugar) || 0 },
  reprocessScrapSugar: { label: "Reprocess Scrap Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.reprocessScrapSugar) || 0 },
};