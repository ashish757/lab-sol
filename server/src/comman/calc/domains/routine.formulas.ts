import { FormulaDefinition } from '../types';

export const routineAnalysisFormulas: Record<string, FormulaDefinition> = {
  // --- Products (Hidden, ADDITIVE) ---
  _primaryJuiceBrix_Product: {
    label: "Primary Juice Brix Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.primaryJuiceBrix) || 0) * (Number(data.caneCrushed) || 0),
  },
  _primaryJuicePol_Product: {
    label: "Primary Juice Pol Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.primaryJuicePol) || 0) * (Number(data.caneCrushed) || 0),
  },
  _mixedJuiceBrix_Product: {
    label: "Mixed Juice Brix Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.mixedJuiceBrix) || 0) * (Number(data.caneCrushed) || 0),
  },
  _mixedJuicePol_Product: {
    label: "Mixed Juice Pol Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.mixedJuicePol) || 0) * (Number(data.caneCrushed) || 0),
  },
  _lastMillJuiceBrix_Product: {
    label: "Last Mill Juice Brix Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.lastMillJuiceBrix) || 0) * (Number(data.caneCrushed) || 0),
  },
  _lastMillJuicePol_Product: {
    label: "Last Mill Juice Pol Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.lastMillJuicePol) || 0) * (Number(data.caneCrushed) || 0),
  },
  
  // Specific quantities can be used instead of caneCrushed if you prefer:
  _bagasseMoisture_Product: {
    label: "Bagasse Moisture Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.bagasseMoisture) || 0) * (Number(data.BagasseCalc || data.caneCrushed) || 0),
  },
  _bagassePol_Product: {
    label: "Bagasse Pol Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.bagassePol) || 0) * (Number(data.BagasseCalc || data.caneCrushed) || 0),
  },
  _filterCakeMoisture_Product: {
    label: "Filter Cake Moisture Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.filterCakeMoisture) || 0) * (Number(data.filterCakeProduction || data.caneCrushed) || 0),
  },
  _filterCakePol_Product: {
    label: "Filter Cake Pol Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.filterCakePol) || 0) * (Number(data.filterCakeProduction || data.caneCrushed) || 0),
  },
  _aMassecuiteBrix_Product: {
    label: "A Massecuite Brix Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.aMassecuiteBrix) || 0) * (Number(data.aMassecuite || data.caneCrushed) || 0),
  },
  _aMassecuitePol_Product: {
    label: "A Massecuite Pol Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.aMassecuitePol) || 0) * (Number(data.aMassecuite || data.caneCrushed) || 0),
  },

  // --- Averages (Visible, DERIVED) ---
  primaryJuiceBrix_Avg: {
    label: "Primary Juice Brix Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._primaryJuiceBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  primaryJuicePol_Avg: {
    label: "Primary Juice Pol Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._primaryJuicePol_Product) || 0) / qty).toFixed(2));
    },
  },
  mixedJuiceBrix_Avg: {
    label: "Mixed Juice Brix Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._mixedJuiceBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  mixedJuicePol_Avg: {
    label: "Mixed Juice Pol Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._mixedJuicePol_Product) || 0) / qty).toFixed(2));
    },
  },
  lastMillJuiceBrix_Avg: {
    label: "Last Mill Juice Brix Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._lastMillJuiceBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  lastMillJuicePol_Avg: {
    label: "Last Mill Juice Pol Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._lastMillJuicePol_Product) || 0) / qty).toFixed(2));
    },
  },
  bagasseMoisture_Avg: {
    label: "Bagasse Moisture Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.BagasseCalc || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._bagasseMoisture_Product) || 0) / qty).toFixed(2));
    },
  },
  bagassePol_Avg: {
    label: "Bagasse Pol Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.BagasseCalc || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._bagassePol_Product) || 0) / qty).toFixed(2));
    },
  },
  filterCakeMoisture_Avg: {
    label: "Filter Cake Moisture Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.filterCakeProduction || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._filterCakeMoisture_Product) || 0) / qty).toFixed(2));
    },
  },
  filterCakePol_Avg: {
    label: "Filter Cake Pol Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.filterCakeProduction || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._filterCakePol_Product) || 0) / qty).toFixed(2));
    },
  },
  aMassecuiteBrix_Avg: {
    label: "A Massecuite Brix Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.aMassecuite || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._aMassecuiteBrix_Product) || 0) / qty).toFixed(2));
    },
  },
  aMassecuitePol_Avg: {
    label: "A Massecuite Pol Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.aMassecuite || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._aMassecuitePol_Product) || 0) / qty).toFixed(2));
    },
  },
};