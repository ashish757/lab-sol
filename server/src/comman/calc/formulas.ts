export const requiredFormulaIds: string[] = [
  'totalCaneCrushed',
  'totalSugarBagged',
  'primaryJuicePurity',
  'mixedJuicePurity',
  'yieldEst',
];

export type FormulaFunction = (data: Record<string, any>) => any;

export const FormulaRegistry: Record<string, FormulaFunction> = {
  totalCaneCrushed: (data) => {
    const gate = Number(data.gate) || 0;
    const road = Number(data.road) || 0;
    return gate + road;
  },

  totalSugarBagged: (data) => {
    const raw = Number(data.rawSugar) || 0;
    const llBold = Number(data.llBold) || 0;
    const brown = Number(data.brownSugar) || 0;
    const s31 = Number(data.s31) || 0;
    const m31 = Number(data.m31) || 0;
    const l31 = Number(data.l31) || 0;
    const export31 = Number(data.sSs31Export) || 0;
    return raw + llBold + brown + s31 + m31 + l31 + export31;
  },

  primaryJuicePurity: (data) => {
    const brix = Number(data.primaryJuiceBrix) || 0;
    const pol = Number(data.primaryJuicePol) || 0;
    if (brix === 0) return 0;
    return Number(((pol / brix) * 100).toFixed(2));
  },

  mixedJuicePurity: (data) => {
    const brix = Number(data.mixedJuiceBrix) || 0;
    const pol = Number(data.mixedJuicePol) || 0;
    if (brix === 0) return 0;
    return Number(((pol / brix) * 100).toFixed(2));
  },

  yieldEst: (data) => {
    const crushed = Number(data.totalCaneCrushed) || 0;
    const bagged = Number(data.totalSugarBagged) || 0;
    if (crushed === 0) return 0;
    return Number(((bagged / crushed) * 100).toFixed(2));
  },
};
