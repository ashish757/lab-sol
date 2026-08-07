import { FormulaDefinition } from '../types';

export const routineAnalysisFormulas: Record<string, FormulaDefinition> = {
  // --- Products (Hidden, ADDITIVE) ---
  _primaryJuiceBrix_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.primaryJuiceBrix) || 0) * (Number(data.caneCrushed) || 0),
  },
  _primaryJuicePol_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.primaryJuicePol) || 0) * (Number(data.caneCrushed) || 0),
  },
  _mixedJuiceBrix_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.mixedJuiceBrix) || 0) * (Number(data.caneCrushed) || 0),
  },
  _mixedJuicePol_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.mixedJuicePol) || 0) * (Number(data.caneCrushed) || 0),
  },
  _lastMillJuiceBrix_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.lastMillJuiceBrix) || 0) * (Number(data.caneCrushed) || 0),
  },
  _lastMillJuicePol_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.lastMillJuicePol) || 0) * (Number(data.caneCrushed) || 0),
  },
  
  // Specific quantities can be used instead of caneCrushed if you prefer:
  _bagasseMoisture_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.bagasseMoisture) || 0) * (Number(data.BagasseCalc || data.caneCrushed) || 0),
  },
  _bagassePol_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.bagassePol) || 0) * (Number(data.BagasseCalc || data.caneCrushed) || 0),
  },
  _filterCakeMoisture_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.filterCakeMoisture) || 0) * (Number(data.filterCakeProduction || data.caneCrushed) || 0),
  },
  _filterCakePol_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.filterCakePol) || 0) * (Number(data.filterCakeProduction || data.caneCrushed) || 0),
  },
  _aMassecuiteBrix_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.aMassecuiteBrix) || 0) * (Number(data.aMassecuite || data.caneCrushed) || 0),
  },
  _aMassecuitePol_Product: {
    type: 'ADDITIVE',
    calculate: (data) => (Number(data.aMassecuitePol) || 0) * (Number(data.aMassecuite || data.caneCrushed) || 0),
  },

  // --- Averages (Visible, DERIVED) ---
  primaryJuiceBrix_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._primaryJuiceBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  primaryJuicePol_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._primaryJuicePol_Product) || 0) / qty).toFixed(2));
    },
  },
  mixedJuiceBrix_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._mixedJuiceBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  mixedJuicePol_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._mixedJuicePol_Product) || 0) / qty).toFixed(2));
    },
  },
  lastMillJuiceBrix_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._lastMillJuiceBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  lastMillJuicePol_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._lastMillJuicePol_Product) || 0) / qty).toFixed(2));
    },
  },
  bagasseMoisture_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.BagasseCalc || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._bagasseMoisture_Product) || 0) / qty).toFixed(2));
    },
  },
  bagassePol_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.BagasseCalc || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._bagassePol_Product) || 0) / qty).toFixed(2));
    },
  },
  filterCakeMoisture_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.filterCakeProduction || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._filterCakeMoisture_Product) || 0) / qty).toFixed(2));
    },
  },
  filterCakePol_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.filterCakeProduction || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._filterCakePol_Product) || 0) / qty).toFixed(2));
    },
  },
  aMassecuiteBrix_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.aMassecuite || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._aMassecuiteBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  aMassecuitePol_Avg: {
    type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.aMassecuite || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._aMassecuitePol_Product) || 0) / qty).toFixed(2));
    },
  },
};