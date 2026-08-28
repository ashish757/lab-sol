import { FormulaDefinition } from '../types';

export const extraAddedFormulas: Record<string, FormulaDefinition> = {
  exhaustCondensateReturn: { type: 'ADDITIVE', calculate: (data) => Number(data.exhaustCondensateReturn) || 0 },
  steamFuelRatio: { type: 'ADDITIVE', calculate: (data) => Number(data.steamFuelRatio) || 0 },
  PolInSugar: { type: 'DERIVED', calculate: (data) => (Number(data.EstimatedRecovery)*Number(data.PolPercentSugar))/100 || 0 },
  EstimatedRecovery: { type: 'DERIVED', calculate: (data) => (Number(data.RecoveryCalc)/Number(data.totalCaneCrushed))*100 || 0 },
  UndilatedJuiceInBagassePcFibre: { type: 'ADDITIVE', calculate: (data) => (Number(data.BrixPercentBagasse)*10000)/(Number(data.primaryJuiceBrix)*Number(data.FiberPercentBagasse)) || 0 },
  CrushRateInclStoppages: { type: 'ADDITIVE', calculate: (data) => Number(data.totalCaneCrushed) || 0 },
  CrushRateExclStoppages: { type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*Number(data.DayAvailableHrs)/Number(data.HoursWorked) || 0 },
  EquivalentCaneSypDiversion: { type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*Number(data.DivertedSyrupPerCane) / Number(data.TotalSyrupPerCane) || 0 },
  molassesSentOutPerCane: { type: 'DERIVED', calculate: (data) => Number(data.molassesSentOut)*100/Number(data.totalCaneCrushed) || 0 },
  imbibitionPercentFiber: { type: 'DERIVED', calculate: (data) => Number(data.ImbibitionPercentCane)*100/Number(data.FiberPercentCane) || 0 },
  grossMixedJuicePerCane: { type: 'DERIVED', calculate: (data) => Number(data.grossMixedJuiceCalc)*100/Number(data.totalCaneCrushed) || 0 },
  DMF: { type: 'DERIVED', calculate: (data) => Number(data.NetMixedJuicePerCane) - Number(data.imbibitionPercentCane) || 0 },
  BaggingRecovery: { type: 'DERIVED', calculate: (data) => Number(data.totalSugarBagged)*100/Number(data.totalCaneCrushed) || 0 },
  NormalisedRecovery: { type: 'DERIVED', calculate: (data) => 0 },
  AvailableSugarProcess: { type: 'DERIVED', calculate: (data) => (Number(data.totalCaneCrushed)*Number(data.EstimatedRecovery)/100) - Number(data.totalSugarBagged) + Number(data.SugarRecovered) || 0 },
  AvailableMolassesProcess: { type: 'DERIVED', calculate: (data) => (Number(data.totalCaneCrushed)*Number(data.EstimatedFinalMolasses)/100) - Number(data.molassesSentOut) + Number(data.MolassesRecovered) || 0 },
  l31Per: { type: 'DERIVED', calculate: (data) => Number(data.l31)*100/Number(data.totalSugarBagged) || 0 },
  m31Per: { type: 'DERIVED', calculate: (data) => Number(data.m31)*100/Number(data.totalSugarBagged) || 0 },
  s31Per: { type: 'DERIVED', calculate: (data) => Number(data.s31)*100/Number(data.totalSugarBagged) || 0 },
  l30Per: { type: 'DERIVED', calculate: (data) => Number(data.l30)*100/Number(data.totalSugarBagged) || 0 },
  m30Per: { type: 'DERIVED', calculate: (data) => Number(data.m30)*100/Number(data.totalSugarBagged) || 0 },
  s30Per: { type: 'DERIVED', calculate: (data) => Number(data.s30)*100/Number(data.totalSugarBagged) || 0 },
  sSs31ExportPer: { type: 'DERIVED', calculate: (data) => Number(data.sSs31Export)*100/Number(data.totalSugarBagged) || 0 },
  rawSugarPer: { type: 'DERIVED', calculate: (data) => Number(data.rawSugar)*100/Number(data.totalSugarBagged) || 0 },
  llBoldPer: { type: 'DERIVED', calculate: (data) => Number(data.llBold)*100/Number(data.totalSugarBagged) || 0 },
  brownSugarPer: { type: 'DERIVED', calculate: (data) => Number(data.brownSugar)*100/Number(data.totalSugarBagged) || 0 },
  ScrapingSugarPer: { type: 'DERIVED', calculate: (data) => Number(data.ScrapingSugar)*100/Number(data.totalSugarBagged) || 0 },
  totalSugarBaggedPer: { type: 'DERIVED', calculate: (data) => Number(data.totalSugarBagged)*100/Number(data.totalSugarBagged) || 0 },
  SugarRecoveredWhiteSugarRemalting: { type: 'ADDITIVE', calculate: (data) => (Number(data.RemaltingWhiteSugar)*Number(data.RemaltingWhiteSugarPol)/100)*((100*(Number(data.RemaltingWhiteSugarPol)*100/Number(data.RemaltingWhiteSugarBrix))-Number(data.finalMolassesPty))/((Number(data.RemaltingWhiteSugarPol)*100/Number(data.RemaltingWhiteSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesRecoveredWhiteSugarRemalting: { type: 'ADDITIVE', calculate: (data) => Number(data.RemaltingWhiteSugar)*(Number(data.RemaltingWhiteSugarBrix)-Number(data.RemaltingWhiteSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecoveredReprocessBrownSugar: { type: 'ADDITIVE', calculate: (data) => (Number(data.reprocessBrownSugar)*Number(data.reprocessBrownSugarPol)/100)*((100*(Number(data.reprocessBrownSugarPol)*100/Number(data.reprocessBrownSugarBrix))-Number(data.finalMolassesPty))/((Number(data.reprocessBrownSugarPol)*100/Number(data.reprocessBrownSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesReprocessBrownSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.reprocessBrownSugar)*(Number(data.reprocessBrownSugarBrix)-Number(data.reprocessBrownSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecoveredReprocessRawSugar: { type: 'ADDITIVE', calculate: (data) => (Number(data.reprocessRawSugar)*Number(data.reprocessRawSugarPol)/100)*((100*(Number(data.reprocessRawSugarPol)*100/Number(data.reprocessRawSugarBrix))-Number(data.finalMolassesPty))/((Number(data.reprocessRawSugarPol)*100/Number(data.reprocessRawSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesRecoveredReprocessRawSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.reprocessRawSugar)*(Number(data.reprocessRawSugarBrix)-Number(data.reprocessRawSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecoveredReprocessScrapSugar: { type: 'ADDITIVE', calculate: (data) => (Number(data.reprocessScrapSugar)*Number(data.ReproceScrapingSugarPol)/100)*((100*(Number(data.ReproceScrapingSugarPol)*100/Number(data.ReproceScrapingSugarBrix))-Number(data.finalMolassesPty))/((Number(data.ReproceScrapingSugarPol)*100/Number(data.ReproceScrapingSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesRecoveredReprocessScrapSugar: { type: 'ADDITIVE', calculate: (data) => Number(data.reprocessScrapSugar)*(Number(data.ReproceScrapingSugarBrix)-Number(data.ReproceScrapingSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecovered: { type: 'ADDITIVE', calculate: (data) => Number(data.SugarRecoveredWhiteSugarRemalting) + Number(data.SugarRecoveredReprocessBrownSugar) + Number(data.SugarRecoveredReprocessRawSugar) + Number(data.SugarRecoveredReprocessScrapSugar) || 0 },
  MolassesRecovered: { type: 'ADDITIVE', calculate: (data) => Number(data.MolassesRecoveredWhiteSugarRemalting) + Number(data.MolassesReprocessBrownSugar) + Number(data.MolassesRecoveredReprocessRawSugar) + Number(data.MolassesRecoveredReprocessScrapSugar) || 0 },
  limePerCane: { type: 'DERIVED', calculate: (data) => Number(data.lime)*100/Number(data.totalCaneCrushed) || 0 },
  sulphurPerCane: { type: 'DERIVED', calculate: (data) => Number(data.sulphur)*100/Number(data.totalCaneCrushed) || 0 },
  ppBagsPerCane: { type: 'DERIVED', calculate: (data) => Number(data.ppBags)*100/(Number(data.totalSugarBagged)*2) || 0 },
  millSanitationChemicalsPerCane: { type: 'DERIVED', calculate: (data) => Number(data.millSanitationChemicals)/Number(data.totalCaneCrushed) || 0 },
  lubricantsPerCane: { type: 'DERIVED', calculate: (data) => Number(data.lubricants)/Number(data.totalCaneCrushed) || 0 },
  greasePerCane: { type: 'DERIVED', calculate: (data) => Number(data.grease)/Number(data.totalCaneCrushed) || 0 },
  phosphoricAcidPerCane: { type: 'DERIVED', calculate: (data) => Number(data.phosphoricAcid)/Number(data.totalCaneCrushed) || 0 },
  colourPrecipitantPerCane: { type: 'DERIVED', calculate: (data) => Number(data.colourPrecipitant)/Number(data.totalCaneCrushed) || 0 },
  aMassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.aMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  a1MassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.a1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  bMassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.bMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  b1MassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.b1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  cMassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.cMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  c1MassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.c1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  r1MassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.r1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  r2MassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.r2Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  r3MassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.r3Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  totalMassecuitePerCane: { type: 'DERIVED', calculate: (data) => Number(data.totalMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  PowerGenPerTonCane: { type: 'DERIVED', calculate: (data) => Number(data.powerGeneration)/(Number(data.totalCaneCrushed)/10) || 0 },
  PowerExportPerTonCane: { type: 'DERIVED', calculate: (data) => Number(data.powerExport)/(Number(data.totalCaneCrushed)/10) || 0 },
  powerImportPerToneCane: { type: 'DERIVED', calculate: (data) => Number(data.powerImport)/(Number(data.totalCaneCrushed)/10) || 0 },
  PowerConsumptionPerTonCane: { type: 'DERIVED', calculate: (data) => Number(data.powerConsumption)/(Number(data.totalCaneCrushed)/10) || 0 },
  boilingHouseSteamConsumptionPerCane: { type: 'DERIVED', calculate: (data) => Number(data.boilingHouseSteamConsumption)*100/(Number(data.totalCaneCrushed)/10) || 0 },
  DMWaterConsumptionPerSteam: { type: 'DERIVED', calculate: (data) => Number(data.dmWaterConsumption)*100/Number(data.steamGeneration) || 0 },
  CapacityUtilization: { type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*100/Number(data.PlantCrushingCapacity) || 0 },
  BagasseConsumptionBoiler: { type: 'DERIVED', calculate: (data) => Number(data.steamGeneration)*10/Number(data.steamFuelRatio) || 0 },
  BagasseConsumptionRVF: { type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*0.8/100 || 0 },
  TotalBagasseConsumption: { type: 'ADDITIVE', calculate: (data) => Number(data.BagasseConsumptionBoiler) + Number(data.BagasseConsumptionRVF) || 0 },
  BagasseSavingCalc: { type: 'ADDITIVE', calculate: (data) => Number(data.BagasseCalc) - Number(data.TotalBagasseConsumption) || 0 },
  BagasseSavingPerCane: { type: 'DERIVED', calculate: (data) => Number(data.BagasseSavingCalc)*100/Number(data.totalCaneCrushed) || 0 },
  ExhaustCondensateReturnPerSteam: { type: 'DERIVED', calculate: (data) => Number(data.exhaustCondensateReturn)*100 / Number(data.boilingHouseSteamConsumption) || 0 },
  WaterVacuumFilterPerCane: { type: 'DERIVED', calculate: (data) => Number(data.WaterVacuumFilter)*10*100/Number(data.totalCaneCrushed) || 0 },
  WaterPanA_RefPerCane: { type: 'DERIVED', calculate: (data) => Number(data.WaterPanA_Ref)*10*100/Number(data.totalCaneCrushed) || 0 },
  WaterPanB_CPerCane: { type: 'DERIVED', calculate: (data) => Number(data.WaterPanB_C)*10*100/Number(data.totalCaneCrushed) || 0 },

  // --- Purity Formulas (Pol * 100 / Brix) — computed on-the-fly, not stored in DB ---
  primaryJuicePty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.primaryJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.primaryJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  MixedJuicePty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.mixedJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.mixedJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  lastMillJuicePty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.lastMillJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.lastMillJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  ClearJuicePty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.clearJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.clearJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  divertedSyrupPty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.divertedSyrupBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.divertedSyrupPol) || 0) * 100 / brix).toFixed(2));
  }},
  unsulphuredSyrupPty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.unsulphuredSyrupBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.unsulphuredSyrupPol) || 0) * 100 / brix).toFixed(2));
  }},
  SulphuredSyrupPty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.sulphuredSyrupBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.sulphuredSyrupPol) || 0) * 100 / brix).toFixed(2));
  }},
  filterJuicePty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.filterJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.filterJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  finalMolassesPty: { type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.finalMolassesBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.finalMolassesPol) || 0) * 100 / brix).toFixed(2));
  }},

  // --- Purity Drop/Rise (now correctly resolved via the purity formulas above) ---
  PurityDropPJtoMJ: { type: 'DERIVED', calculate: (data) => Number(data.primaryJuicePty) - Number(data.MixedJuicePty) || 0 },
  PurityRiseMJtoCJ: { type: 'DERIVED', calculate: (data) => Number(data.ClearJuicePty) - Number(data.MixedJuicePty) || 0 },
  PurityDropCJtoSyrup: { type: 'DERIVED', calculate: (data) => Number(data.ClearJuicePty) - Number(data.SulphuredSyrupPty) || 0 },
  PurityDropPJtoFM: { type: 'DERIVED', calculate: (data) => Number(data.primaryJuicePty) - Number(data.finalMolassesPty) || 0 },
};
