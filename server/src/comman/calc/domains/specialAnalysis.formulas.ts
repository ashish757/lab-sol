import { FormulaDefinition } from '../types';

export const specialAnalysisFormulas: Record<string, FormulaDefinition> = {
  // --- Products (Hidden, ADDITIVE) ---
  _divertedSyrupTrs_Product: {
    label: "Diverted Syrup Trs Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.divertedSyrupTrs) || 0) * (Number(data.caneCrushed) || 0),
  },
  _BheavyMolassesTrs_Product: {
    label: "Bheavy Molasses Trs Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.BheavyMolassesTrs) || 0) * (Number(data.caneCrushed) || 0),
  },
  _FinalMolassesTrs_Product: {
    label: "Final Molasses Trs Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.FinalMolassesTrs) || 0) * (Number(data.caneCrushed) || 0),
  },
  _MJSucrosePurity_Product: {
    label: "MJSucrose Purity Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.MJSucrosePurity) || 0) * (Number(data.grossMixedJuice || data.caneCrushed) || 0),
  },
  _rsPrimaryJuice_Product: {
    label: "Rs Primary Juice Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.rsPrimaryJuice) || 0) * (Number(data.caneCrushed) || 0),
  },
  _primaryJuiceColour_Product: {
    label: "Primary Juice Colour Product", type: 'ADDITIVE',
    calculate: (data) => (Number(data.primaryJuiceColour) || 0) * (Number(data.caneCrushed) || 0),
  },

  // --- Averages (Visible, DERIVED) ---
  divertedSyrupTrs_Avg: {
    label: "Diverted Syrup Trs Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._divertedSyrupTrs_Product) || 0) / qty).toFixed(2));
    },
  },
  BheavyMolassesTrs_Avg: {
    label: "Bheavy Molasses Trs Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._BheavyMolassesTrs_Product) || 0) / qty).toFixed(2));
    },
  },
  FinalMolassesTrs_Avg: {
    label: "Final Molasses Trs Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._FinalMolassesTrs_Product) || 0) / qty).toFixed(2));
    },
  },
  MJSucrosePurity_Avg: {
    label: "MJSucrose Purity Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.grossMixedJuice || data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._MJSucrosePurity_Product) || 0) / qty).toFixed(2));
    },
  },
  rsPrimaryJuice_Avg: {
    label: "Rs Primary Juice Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._rsPrimaryJuice_Product) || 0) / qty).toFixed(2));
    },
  },
  primaryJuiceColour_Avg: {
    label: "Primary Juice Colour Avg", type: 'DERIVED',
    calculate: (data) => {
      const qty = Number(data.caneCrushed) || 0;
      if (qty === 0) return 0;
      return Number(((Number(data._primaryJuiceColour_Product) || 0) / qty).toFixed(2));
    },
  },
};