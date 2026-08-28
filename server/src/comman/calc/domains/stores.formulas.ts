import { FormulaDefinition } from '../types';

export const storesConsumptionFormulas: Record<string, FormulaDefinition> = {
  lime: { label: "Lime", type: 'ADDITIVE', calculate: (data) => Number(data.lime) || 0 },
  sulphur: { label: "Sulphur", type: 'ADDITIVE', calculate: (data) => Number(data.sulphur) || 0 },
  ppBags: { label: "Pp Bags", type: 'ADDITIVE', calculate: (data) => Number(data.ppBags) || 0 },
  millSanitationChemicals: { label: "Mill Sanitation Chemicals", type: 'ADDITIVE', calculate: (data) => Number(data.millSanitationChemicals) || 0 },
  lubricants: { label: "Lubricants", type: 'ADDITIVE', calculate: (data) => Number(data.lubricants) || 0 },
  grease: { label: "Grease", type: 'ADDITIVE', calculate: (data) => Number(data.grease) || 0 },
  phosphoricAcid: { label: "Phosphoric Acid", type: 'ADDITIVE', calculate: (data) => Number(data.phosphoricAcid) || 0 },
  colourPrecipitant: { label: "Colour Precipitant", type: 'ADDITIVE', calculate: (data) => Number(data.colourPrecipitant) || 0 },
};