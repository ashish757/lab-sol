import { FormulaDefinition } from '../types';

export const sugarAnalysisLGradeFormulas: Record<string, FormulaDefinition> = {
  // 1. Calculate the hidden "Products" (Quantity x Quality) - These are ADDITIVE
  _LsugarColourGs10_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.LsugarColourGs10) || 0) * (Number(data.l31) || 0),
  },
  _LsugarColourGs8_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.LsugarColourGs8) || 0) * (Number(data.l31) || 0),
  },
  _LsugarReflectance_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.LsugarReflectance) || 0) * (Number(data.l31) || 0),
  },
  _Lmoisture_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.Lmoisture) || 0) * (Number(data.l31) || 0),
  },
  _llBoldColour_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.llBoldColour) || 0) * (Number(data.llBold) || 0),
  },
  _L30sugarColourGs10_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.L30sugarColourGs10) || 0) * (Number(data.l30) || 0),
  },

  // 2. Calculate the actual visible metrics - These are DERIVED
  // The engine will divide today's Product by today's Qty for the 'onDate' value,
  // and it will divide the Month's Total Product by the Month's Total Qty for the 'toMonth' value!
  
  LsugarColourGs10_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const product = Number(data._LsugarColourGs10_Product) || 0;
      const qty = Number(data.l31) || 0;
      if (qty === 0) return 0;
      return Number((product / qty).toFixed(2));
    },
  },
  
  LsugarColourGs8_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const product = Number(data._LsugarColourGs8_Product) || 0;
      const qty = Number(data.l31) || 0;
      if (qty === 0) return 0;
      return Number((product / qty).toFixed(2));
    },
  },

  LsugarReflectance_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const product = Number(data._LsugarReflectance_Product) || 0;
      const qty = Number(data.l31) || 0;
      if (qty === 0) return 0;
      return Number((product / qty).toFixed(2));
    },
  },

  Lmoisture_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const product = Number(data._Lmoisture_Product) || 0;
      const qty = Number(data.l31) || 0;
      if (qty === 0) return 0;
      return Number((product / qty).toFixed(4)); // Moisture usually needs more decimal places
    },
  },

  llBoldColour_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const product = Number(data._llBoldColour_Product) || 0;
      const qty = Number(data.llBold) || 0;
      if (qty === 0) return 0;
      return Number((product / qty).toFixed(2));
    },
  },

  L30sugarColourGs10_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const product = Number(data._L30sugarColourGs10_Product) || 0;
      const qty = Number(data.l30) || 0;
      if (qty === 0) return 0;
      return Number((product / qty).toFixed(2));
    },
  },
};