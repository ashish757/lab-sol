import { FormulaDefinition } from '../types';

export const manufacturingFormulas: Record<string, FormulaDefinition> = {
  // --- Raw Data Pass-Throughs (Quantities) ---
  caneCrushed: { label: "Cane Crushed", type: 'ADDITIVE', calculate: (data) => Number(data.caneCrushed) || 0 },
  grossMixedJuice: { label: "Gross Mixed Juice", type: 'ADDITIVE', calculate: (data) => Number(data.grossMixedJuice) || 0 },
  filterCakeProduction: { label: "Filter Cake Production", type: 'ADDITIVE', calculate: (data) => Number(data.filterCakeProduction) || 0 },
  aMassecuite: { label: "A Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.aMassecuite) || 0 },
  
  grossMixedJuiceRawData: { label: "Gross Mixed Juice Raw Data", type: 'ADDITIVE', calculate: (data) => Number(data.grossMixedJuiceRawData) || 0 },
  imbibitionWaterCalc: {
    label: "Imbibition Water Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const rawData = Number(data.imbibitionWaterRawData) || 0;
      const spGravity = Number(data.imbibitionWaterSpecificGavity) || 0;
      return rawData * spGravity;
    },
  },

  imbibitionPercentCane: {
    label: "Imbibition Percent Cane", type: 'DERIVED',
    calculate: (data) => {
      const water = Number(data.imbibitionWaterCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((water / cane) * 100).toFixed(2));
    },
  },

  grossMixedJuiceCalc: {
    label: "Gross Mixed Juice Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const rawData = Number(data.grossMixedJuiceRawData) || 0;
      const spGravity = Number(data.mixedJuiceSpecificGravity) || 0;
      return rawData * spGravity;
    },
  },

  DirtCalc: {
    label: "Dirt Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const gross = Number(data.grossMixedJuiceCalc) || 0;
      const dirt = Number(data.dirtPercent) || 0;
      return (gross * dirt) / 100;
    },
  },

  NetMixedJuiceCalc: {
    label: "Net Mixed Juice Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const gross = Number(data.grossMixedJuiceCalc) || 0;
      const dirt = Number(data.DirtCalc) || 0;
      return gross - dirt;
    },
  },

  NetMixedJuicePercentCane: {
    label: "Net Mixed Juice Percent Cane", type: 'DERIVED',
    calculate: (data) => {
      const net = Number(data.NetMixedJuiceCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((net / cane) * 100).toFixed(2));
    },
  },

  BagasseCalc: {
    label: "Bagasse Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const cane = Number(data.caneCrushed) || 0;
      const water = Number(data.imbibitionWaterCalc) || 0;
      const grossJuice = Number(data.grossMixedJuiceCalc) || 0;
      return cane + water - grossJuice;
    },
  },

  BagassePercentCane: {
    label: "Bagasse Percent Cane", type: 'DERIVED',
    calculate: (data) => {
      const bagasse = Number(data.BagasseCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((bagasse / cane) * 100).toFixed(2));
    },
  },

  PolinBagasseCalc: {
    label: "Polin Bagasse Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const bagasse = Number(data.BagasseCalc) || 0;
      const pol = Number(data.bagassePol) || 0;
      return (bagasse * pol) / 100;
    },
  },

  PolinBagassePercent: {
    label: "Polin Bagasse Percent", type: 'DERIVED',
    calculate: (data) => {
      const polInBagasse = Number(data.PolinBagasseCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((polInBagasse / cane) * 100).toFixed(2));
    },
  },

  MoistureinBagasseCalc: {
    label: "Moisturein Bagasse Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const bagasse = Number(data.BagasseCalc) || 0;
      const moisture = Number(data.bagasseMoisture) || 0;
      return (bagasse * moisture) / 100;
    },
  },

  BrixPercentBagasse: {
    label: "Brix Percent Bagasse", type: 'DERIVED',
    calculate: (data) => {
      const pol = Number(data.bagassePol) || 0;
      const lmBrix = Number(data.lastMillJuiceBrix) || 0;
      const lmPol = Number(data.lastMillJuicePol) || 0;
      const lmPurity = lmBrix === 0 ? 0 : (lmPol / lmBrix) * 100;
      if (lmPurity === 0) return 0;
      return Number(((pol / lmPurity) * 100).toFixed(2));
    },
  },

  BrixinBagasse: {
    label: "Brixin Bagasse", type: 'ADDITIVE',
    calculate: (data) => {
      const bagasse = Number(data.BagasseCalc) || 0;
      const brixPct = Number(data.BrixPercentBagasse) || 0;
      return (bagasse * brixPct) / 100;
    },
  },

  FiberPercentBagasse: {
    label: "Fiber Percent Bagasse", type: 'DERIVED',
    calculate: (data) => {
      const brixPct = Number(data.BrixPercentBagasse) || 0;
      const moisture = Number(data.bagasseMoisture) || 0;
      return 100 - brixPct - moisture;
    },
  },

  FiberinBagasse: {
    label: "Fiberin Bagasse", type: 'ADDITIVE',
    calculate: (data) => {
      const bagasse = Number(data.BagasseCalc) || 0;
      const fiberPct = Number(data.FiberPercentBagasse) || 0;
      return (bagasse * fiberPct) / 100;
    },
  },

  FiberPercentCane: {
    label: "Fiber Percent Cane", type: 'DERIVED',
    calculate: (data) => {
      const fiber = Number(data.FiberinBagasse) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((fiber / cane) * 100).toFixed(2));
    },
  },

  BrixinMixedJuiceCalc: {
    label: "Brixin Mixed Juice Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const netJuice = Number(data.NetMixedJuiceCalc) || 0;
      const brix = Number(data.mixedJuiceBrix) || 0;
      return (netJuice * brix) / 100;
    },
  },

  BrixinMixedJuice: {
    label: "Brixin Mixed Juice", type: 'DERIVED',
    calculate: (data) => {
      const brixJuice = Number(data.BrixinMixedJuiceCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((brixJuice / cane) * 100).toFixed(2));
    },
  },

  PolinMixedJuiceCalc: {
    label: "Polin Mixed Juice Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const netJuice = Number(data.NetMixedJuiceCalc) || 0;
      const pol = Number(data.mixedJuicePol) || 0;
      return (netJuice * pol) / 100;
    },
  },

  PolinMixedJuice: {
    label: "Polin Mixed Juice", type: 'DERIVED',
    calculate: (data) => {
      const polJuice = Number(data.PolinMixedJuiceCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((polJuice / cane) * 100).toFixed(2));
    },
  },

  FilterCakePrecentCane: {
    label: "Filter Cake Precent Cane", type: 'DERIVED',
    calculate: (data) => {
      const cake = Number(data.filterCakeProduction) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((cake / cane) * 100).toFixed(2));
    },
  },

  PolinFilterCakeCalc: {
    label: "Polin Filter Cake Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const pol = Number(data.filterCakePol) || 0;
      const cake = Number(data.filterCakeProduction) || 0;
      return (pol * cake) / 100;
    },
  },

  PolinFilterCake: {
    label: "Polin Filter Cake", type: 'DERIVED',
    calculate: (data) => {
      const polCake = Number(data.PolinFilterCakeCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((polCake / cane) * 100).toFixed(2));
    },
  },

  PolinClearJuiceCalc: {
    label: "Polin Clear Juice Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const polMixed = Number(data.PolinMixedJuiceCalc) || 0;
      const polCake = Number(data.PolinFilterCakeCalc) || 0;
      return polMixed - polCake;
    },
  },

  PolinClearJuice: {
    label: "Polin Clear Juice", type: 'DERIVED',
    calculate: (data) => {
      const polClear = Number(data.PolinClearJuiceCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((polClear / cane) * 100).toFixed(2));
    },
  },

  ClearJuiceQuantity: {
    label: "Clear Juice Quantity", type: 'ADDITIVE',
    calculate: (data) => {
      const polClear = Number(data.PolinClearJuiceCalc) || 0;
      const pol = Number(data.clearJuicePol) || 0;
      if (pol === 0) return 0;
      return (polClear / pol) * 100;
    },
  },

  BrixinClearJuiceCalc: {
    label: "Brixin Clear Juice Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const qty = Number(data.ClearJuiceQuantity) || 0;
      const brix = Number(data.clearJuiceBrix) || 0;
      return (qty * brix) / 100;
    },
  },

  BrixinClearJuicePercentCane: {
    label: "Brixin Clear Juice Percent Cane", type: 'DERIVED',
    calculate: (data) => {
      const brixClear = Number(data.BrixinClearJuiceCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((brixClear / cane) * 100).toFixed(2));
    },
  },

  NonSugarinClearJuice: {
    label: "Non Sugarin Clear Juice", type: 'ADDITIVE',
    calculate: (data) => {
      const brixClear = Number(data.BrixinClearJuiceCalc) || 0;
      const polClear = Number(data.PolinClearJuiceCalc) || 0;
      return brixClear - polClear;
    },
  },

  NonSugarinFinalMolasses: {
    label: "Non Sugarin Final Molasses", type: 'DERIVED',
    calculate: (data) => {
      const brix = Number(data.finalMolassesBrix) || 0;
      const pol = Number(data.finalMolassesPol) || 0;
      return brix - pol;
    },
  },

  EstimatedFinalMolassesCalc: {
    label: "Estimated Final Molasses Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const nsClear = Number(data.NonSugarinClearJuice) || 0;
      const nsMolasses = Number(data.NonSugarinFinalMolasses) || 0;
      if (nsMolasses === 0) return 0;
      return (nsClear / nsMolasses) * 100;
    },
  },

  EstimatedFinalMolasses: {
    label: "Estimated Final Molasses", type: 'DERIVED',
    calculate: (data) => {
      const estMolasses = Number(data.EstimatedFinalMolassesCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((estMolasses / cane) * 100).toFixed(2));
    },
  },

  BrixinFinalMolassesCalc: {
    label: "Brixin Final Molasses Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const estMolasses = Number(data.EstimatedFinalMolassesCalc) || 0;
      const brix = Number(data.finalMolassesBrix) || 0;
      return (estMolasses * brix) / 100;
    },
  },

  PolinFinalMolassesCalc: {
    label: "Polin Final Molasses Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const estMolasses = Number(data.EstimatedFinalMolassesCalc) || 0;
      const pol = Number(data.finalMolassesPol) || 0;
      return (estMolasses * pol) / 100;
    },
  },

  PolinFinalMolasses: {
    label: "Polin Final Molasses", type: 'DERIVED',
    calculate: (data) => {
      const polMolasses = Number(data.PolinFinalMolassesCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((polMolasses / cane) * 100).toFixed(2));
    },
  },

  PolinCaneCalc: {
    label: "Polin Cane Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const polMixed = Number(data.PolinMixedJuiceCalc) || 0;
      const polBagasse = Number(data.PolinBagasseCalc) || 0;
      return polMixed + polBagasse;
    },
  },

  PolinCane: {
    label: "Polin Cane", type: 'DERIVED',
    calculate: (data) => {
      const polCane = Number(data.PolinCaneCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((polCane / cane) * 100).toFixed(2));
    },
  },

  UnknownLossesCalc: {
    label: "Unknown Losses Calc", type: 'DERIVED', 
    calculate: (data) => {
      const losses = Number(data.unknownLosses) || 0;
      const cane = Number(data.caneCrushed) || 0;
      return (losses * cane) / 100;
    },
  },

  PolUndetermined: {
    label: "Pol Undetermined", type: 'DERIVED',
    calculate: (data) => {
      const lossesCalc = Number(data.UnknownLossesCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((lossesCalc / cane) * 100).toFixed(2));
    },
  },

  TotalSyrupCalc: {
    label: "Total Syrup Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const qty = Number(data.ClearJuiceQuantity) || 0;
      const clearBrix = Number(data.clearJuiceBrix) || 0;
      const divBrix = Number(data.divertedSyrupBrix) || 0;
      if (divBrix === 0) return 0;
      return (qty * clearBrix) / divBrix;
    },
  },

  TotalSyrupPerCane: {
    label: "Total Syrup Per Cane", type: 'DERIVED',
    calculate: (data) => {
      const syrup = Number(data.TotalSyrupCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((syrup / cane) * 100).toFixed(2));
    },
  },

  DivertedSyrupPerCane: {
    label: "Diverted Syrup Per Cane", type: 'DERIVED',
    calculate: (data) => {
      const syrup = Number(data.divertedSyrup) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((syrup / cane) * 100).toFixed(2));
    },
  },

  BrixinDivertedSyrup: {
    label: "Brixin Diverted Syrup", type: 'ADDITIVE',
    calculate: (data) => {
      const cane = Number(data.caneCrushed) || 0;
      const pct = Number(data.DivertedSyrupPerCane) || 0;
      const brix = Number(data.divertedSyrupBrix) || 0;
      return (cane * pct * brix) / 10000;
    },
  },

  PolinDivertedSyrup: {
    label: "Polin Diverted Syrup", type: 'ADDITIVE',
    calculate: (data) => {
      const cane = Number(data.caneCrushed) || 0;
      const pct = Number(data.DivertedSyrupPerCane) || 0;
      const pol = Number(data.divertedSyrupPol) || 0;
      return (cane * pct * pol) / 10000;
    },
  },

  NonSugarinDivertedSyrup: {
    label: "Non Sugarin Diverted Syrup", type: 'ADDITIVE',
    calculate: (data) => {
      const brix = Number(data.BrixinDivertedSyrup) || 0;
      const pol = Number(data.PolinDivertedSyrup) || 0;
      return brix - pol;
    },
  },

  PolinDivertedSyrupPerCane: {
    label: "Polin Diverted Syrup Per Cane", type: 'DERIVED',
    calculate: (data) => {
      const pol = Number(data.PolinDivertedSyrup) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((pol / cane) * 100).toFixed(2));
    },
  },

  TotalLossesCalc: {
    label: "Total Losses Calc", type: 'DERIVED', 
    calculate: (data) => {
      const bagasse = Number(data.PolinBagasseCalc) || 0;
      const filter = Number(data.PolinFilterCakeCalc) || 0;
      const molasses = Number(data.PolinFinalMolassesCalc) || 0;
      const unknown = Number(data.UnknownLossesCalc) || 0;
      const diverted = Number(data.PolinDivertedSyrup) || 0;
      return bagasse + filter + molasses + unknown + diverted;
    },
  },

  TotalLosses: {
    label: "Total Losses", type: 'DERIVED',
    calculate: (data) => {
      const losses = Number(data.TotalLossesCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((losses / cane) * 100).toFixed(2));
    },
  },

  RecoveryCalc: {
    label: "Recovery Calc", type: 'ADDITIVE',
    calculate: (data) => {
      const polCane = Number(data.PolinCaneCalc) || 0;
      const losses = Number(data.TotalLossesCalc) || 0;
      return polCane - losses;
    },
  },

  Recovery: {
    label: "Recovery", type: 'DERIVED',
    calculate: (data) => {
      const rec = Number(data.RecoveryCalc) || 0;
      const cane = Number(data.caneCrushed) || 0;
      if (cane === 0) return 0;
      return Number(((rec / cane) * 100).toFixed(2));
    },
  },

  PolinSugar: {
    label: "Polin Sugar", type: 'DERIVED',
    calculate: (data) => {
      const rec = Number(data.Recovery) || 0;
      const polPct = Number(data.polPercentSugar) || 0;
      return (rec * polPct) / 100;
    },
  }
};