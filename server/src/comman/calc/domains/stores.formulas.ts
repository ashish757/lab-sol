import { FormulaDefinition } from '../types';

export const storesConsumptionFormulas: Record<string, FormulaDefinition> = {
  lime: { type: 'ADDITIVE', calculate: (data) => Number(data.lime) || 0 },
  sulphur: { type: 'ADDITIVE', calculate: (data) => Number(data.sulphur) || 0 },
  ppBags: { type: 'ADDITIVE', calculate: (data) => Number(data.ppBags) || 0 },
  millSanitationChemicals: { type: 'ADDITIVE', calculate: (data) => Number(data.millSanitationChemicals) || 0 },
  lubricants: { type: 'ADDITIVE', calculate: (data) => Number(data.lubricants) || 0 },
  grease: { type: 'ADDITIVE', calculate: (data) => Number(data.grease) || 0 },
  phosphoricAcid: { type: 'ADDITIVE', calculate: (data) => Number(data.phosphoricAcid) || 0 },
  colourPrecipitant: { type: 'ADDITIVE', calculate: (data) => Number(data.colourPrecipitant) || 0 },
};