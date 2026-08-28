import { FormulaDefinition } from '../types';

export const extraAddedFormulas: Record<string, FormulaDefinition> = {
  exhaustCondensateReturn: { label: "Exhaust Condensate Return", type: 'ADDITIVE', calculate: (data) => Number(data.exhaustCondensateReturn) || 0 },
  steamFuelRatio: { label: "Steam Fuel Ratio", type: 'ADDITIVE', calculate: (data) => Number(data.steamFuelRatio) || 0 },
  PolInSugar: { label: "Pol In Sugar", type: 'DERIVED', calculate: (data) => (Number(data.EstimatedRecovery)*Number(data.PolPercentSugar))/100 || 0 },
  EstimatedRecovery: { label: "Estimated Recovery", type: 'DERIVED', calculate: (data) => (Number(data.RecoveryCalc)/Number(data.totalCaneCrushed))*100 || 0 },
  UndilatedJuiceInBagassePcFibre: { label: "Undilated Juice In Bagasse Pc Fibre", type: 'ADDITIVE', calculate: (data) => (Number(data.BrixPercentBagasse)*10000)/(Number(data.primaryJuiceBrix)*Number(data.FiberPercentBagasse)) || 0 },
  CrushRateInclStoppages: { label: "Crush Rate Incl Stoppages", type: 'ADDITIVE', calculate: (data) => Number(data.totalCaneCrushed) || 0 },
  CrushRateExclStoppages: { label: "Crush Rate Excl Stoppages", type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*Number(data.DayAvailableHrs)/Number(data.HoursWorked) || 0 },
  EquivalentCaneSypDiversion: { label: "Equivalent Cane Syp Diversion", type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*Number(data.DivertedSyrupPerCane) / Number(data.TotalSyrupPerCane) || 0 },
  molassesSentOutPerCane: { label: "Molasses Sent Out Per Cane", type: 'DERIVED', calculate: (data) => Number(data.molassesSentOut)*100/Number(data.totalCaneCrushed) || 0 },
  imbibitionPercentFiber: { label: "Imbibition Percent Fiber", type: 'DERIVED', calculate: (data) => Number(data.ImbibitionPercentCane)*100/Number(data.FiberPercentCane) || 0 },
  grossMixedJuicePerCane: { label: "Gross Mixed Juice Per Cane", type: 'DERIVED', calculate: (data) => Number(data.grossMixedJuiceCalc)*100/Number(data.totalCaneCrushed) || 0 },
  DMF: { label: "DMF", type: 'DERIVED', calculate: (data) => Number(data.NetMixedJuicePerCane) - Number(data.imbibitionPercentCane) || 0 },
  BaggingRecovery: { label: "Bagging Recovery", type: 'DERIVED', calculate: (data) => Number(data.totalSugarBagged)*100/Number(data.totalCaneCrushed) || 0 },
  NormalisedRecovery: { label: "Normalised Recovery", type: 'DERIVED', calculate: (data) => 0 },
  AvailableSugarProcess: { label: "Available Sugar Process", type: 'DERIVED', calculate: (data) => (Number(data.totalCaneCrushed)*Number(data.EstimatedRecovery)/100) - Number(data.totalSugarBagged) + Number(data.SugarRecovered) || 0 },
  AvailableMolassesProcess: { label: "Available Molasses Process", type: 'DERIVED', calculate: (data) => (Number(data.totalCaneCrushed)*Number(data.EstimatedFinalMolasses)/100) - Number(data.molassesSentOut) + Number(data.MolassesRecovered) || 0 },
  l31Per: { label: "L31Per", type: 'DERIVED', calculate: (data) => Number(data.l31)*100/Number(data.totalSugarBagged) || 0 },
  m31Per: { label: "M31Per", type: 'DERIVED', calculate: (data) => Number(data.m31)*100/Number(data.totalSugarBagged) || 0 },
  s31Per: { label: "S31Per", type: 'DERIVED', calculate: (data) => Number(data.s31)*100/Number(data.totalSugarBagged) || 0 },
  l30Per: { label: "L30Per", type: 'DERIVED', calculate: (data) => Number(data.l30)*100/Number(data.totalSugarBagged) || 0 },
  m30Per: { label: "M30Per", type: 'DERIVED', calculate: (data) => Number(data.m30)*100/Number(data.totalSugarBagged) || 0 },
  s30Per: { label: "S30Per", type: 'DERIVED', calculate: (data) => Number(data.s30)*100/Number(data.totalSugarBagged) || 0 },
  sSs31ExportPer: { label: "S Ss31Export Per", type: 'DERIVED', calculate: (data) => Number(data.sSs31Export)*100/Number(data.totalSugarBagged) || 0 },
  rawSugarPer: { label: "Raw Sugar Per", type: 'DERIVED', calculate: (data) => Number(data.rawSugar)*100/Number(data.totalSugarBagged) || 0 },
  llBoldPer: { label: "Ll Bold Per", type: 'DERIVED', calculate: (data) => Number(data.llBold)*100/Number(data.totalSugarBagged) || 0 },
  brownSugarPer: { label: "Brown Sugar Per", type: 'DERIVED', calculate: (data) => Number(data.brownSugar)*100/Number(data.totalSugarBagged) || 0 },
  ScrapingSugarPer: { label: "Scraping Sugar Per", type: 'DERIVED', calculate: (data) => Number(data.ScrapingSugar)*100/Number(data.totalSugarBagged) || 0 },
  totalSugarBaggedPer: { label: "Total Sugar Bagged Per", type: 'DERIVED', calculate: (data) => Number(data.totalSugarBagged)*100/Number(data.totalSugarBagged) || 0 },
  SugarRecoveredWhiteSugarRemalting: { label: "Sugar Recovered White Sugar Remalting", type: 'ADDITIVE', calculate: (data) => (Number(data.RemaltingWhiteSugar)*Number(data.RemaltingWhiteSugarPol)/100)*((100*(Number(data.RemaltingWhiteSugarPol)*100/Number(data.RemaltingWhiteSugarBrix))-Number(data.finalMolassesPty))/((Number(data.RemaltingWhiteSugarPol)*100/Number(data.RemaltingWhiteSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesRecoveredWhiteSugarRemalting: { label: "Molasses Recovered White Sugar Remalting", type: 'ADDITIVE', calculate: (data) => Number(data.RemaltingWhiteSugar)*(Number(data.RemaltingWhiteSugarBrix)-Number(data.RemaltingWhiteSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecoveredReprocessBrownSugar: { label: "Sugar Recovered Reprocess Brown Sugar", type: 'ADDITIVE', calculate: (data) => (Number(data.reprocessBrownSugar)*Number(data.reprocessBrownSugarPol)/100)*((100*(Number(data.reprocessBrownSugarPol)*100/Number(data.reprocessBrownSugarBrix))-Number(data.finalMolassesPty))/((Number(data.reprocessBrownSugarPol)*100/Number(data.reprocessBrownSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesReprocessBrownSugar: { label: "Molasses Reprocess Brown Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.reprocessBrownSugar)*(Number(data.reprocessBrownSugarBrix)-Number(data.reprocessBrownSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecoveredReprocessRawSugar: { label: "Sugar Recovered Reprocess Raw Sugar", type: 'ADDITIVE', calculate: (data) => (Number(data.reprocessRawSugar)*Number(data.reprocessRawSugarPol)/100)*((100*(Number(data.reprocessRawSugarPol)*100/Number(data.reprocessRawSugarBrix))-Number(data.finalMolassesPty))/((Number(data.reprocessRawSugarPol)*100/Number(data.reprocessRawSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesRecoveredReprocessRawSugar: { label: "Molasses Recovered Reprocess Raw Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.reprocessRawSugar)*(Number(data.reprocessRawSugarBrix)-Number(data.reprocessRawSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecoveredReprocessScrapSugar: { label: "Sugar Recovered Reprocess Scrap Sugar", type: 'ADDITIVE', calculate: (data) => (Number(data.reprocessScrapSugar)*Number(data.ReproceScrapingSugarPol)/100)*((100*(Number(data.ReproceScrapingSugarPol)*100/Number(data.ReproceScrapingSugarBrix))-Number(data.finalMolassesPty))/((Number(data.ReproceScrapingSugarPol)*100/Number(data.ReproceScrapingSugarBrix))*(100-Number(data.finalMolassesPty)))) || 0 },
  MolassesRecoveredReprocessScrapSugar: { label: "Molasses Recovered Reprocess Scrap Sugar", type: 'ADDITIVE', calculate: (data) => Number(data.reprocessScrapSugar)*(Number(data.ReproceScrapingSugarBrix)-Number(data.ReproceScrapingSugarPol))/(Number(data.finalMolassesBrix)-Number(data.finalMolassesPol)) || 0 },
  SugarRecovered: { label: "Sugar Recovered", type: 'ADDITIVE', calculate: (data) => Number(data.SugarRecoveredWhiteSugarRemalting) + Number(data.SugarRecoveredReprocessBrownSugar) + Number(data.SugarRecoveredReprocessRawSugar) + Number(data.SugarRecoveredReprocessScrapSugar) || 0 },
  MolassesRecovered: { label: "Molasses Recovered", type: 'ADDITIVE', calculate: (data) => Number(data.MolassesRecoveredWhiteSugarRemalting) + Number(data.MolassesReprocessBrownSugar) + Number(data.MolassesRecoveredReprocessRawSugar) + Number(data.MolassesRecoveredReprocessScrapSugar) || 0 },
  limePerCane: { label: "Lime Per Cane", type: 'DERIVED', calculate: (data) => Number(data.lime)*100/Number(data.totalCaneCrushed) || 0 },
  sulphurPerCane: { label: "Sulphur Per Cane", type: 'DERIVED', calculate: (data) => Number(data.sulphur)*100/Number(data.totalCaneCrushed) || 0 },
  ppBagsPerCane: { label: "Pp Bags Per Cane", type: 'DERIVED', calculate: (data) => Number(data.ppBags)*100/(Number(data.totalSugarBagged)*2) || 0 },
  millSanitationChemicalsPerCane: { label: "Mill Sanitation Chemicals Per Cane", type: 'DERIVED', calculate: (data) => Number(data.millSanitationChemicals)/Number(data.totalCaneCrushed) || 0 },
  lubricantsPerCane: { label: "Lubricants Per Cane", type: 'DERIVED', calculate: (data) => Number(data.lubricants)/Number(data.totalCaneCrushed) || 0 },
  greasePerCane: { label: "Grease Per Cane", type: 'DERIVED', calculate: (data) => Number(data.grease)/Number(data.totalCaneCrushed) || 0 },
  phosphoricAcidPerCane: { label: "Phosphoric Acid Per Cane", type: 'DERIVED', calculate: (data) => Number(data.phosphoricAcid)/Number(data.totalCaneCrushed) || 0 },
  colourPrecipitantPerCane: { label: "Colour Precipitant Per Cane", type: 'DERIVED', calculate: (data) => Number(data.colourPrecipitant)/Number(data.totalCaneCrushed) || 0 },
  aMassecuitePerCane: { label: "A Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.aMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  a1MassecuitePerCane: { label: "A1Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.a1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  bMassecuitePerCane: { label: "B Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.bMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  b1MassecuitePerCane: { label: "B1Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.b1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  cMassecuitePerCane: { label: "C Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.cMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  c1MassecuitePerCane: { label: "C1Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.c1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  r1MassecuitePerCane: { label: "R1Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.r1Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  r2MassecuitePerCane: { label: "R2Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.r2Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  r3MassecuitePerCane: { label: "R3Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.r3Massecuite)*100/Number(data.totalCaneCrushed) || 0 },
  totalMassecuitePerCane: { label: "Total Massecuite Per Cane", type: 'DERIVED', calculate: (data) => Number(data.totalMassecuite)*100/Number(data.totalCaneCrushed) || 0 },
  PowerGenPerTonCane: { label: "Power Gen Per Ton Cane", type: 'DERIVED', calculate: (data) => Number(data.powerGeneration)/(Number(data.totalCaneCrushed)/10) || 0 },
  PowerExportPerTonCane: { label: "Power Export Per Ton Cane", type: 'DERIVED', calculate: (data) => Number(data.powerExport)/(Number(data.totalCaneCrushed)/10) || 0 },
  powerImportPerToneCane: { label: "Power Import Per Tone Cane", type: 'DERIVED', calculate: (data) => Number(data.powerImport)/(Number(data.totalCaneCrushed)/10) || 0 },
  PowerConsumptionPerTonCane: { label: "Power Consumption Per Ton Cane", type: 'DERIVED', calculate: (data) => Number(data.powerConsumption)/(Number(data.totalCaneCrushed)/10) || 0 },
  boilingHouseSteamConsumptionPerCane: { label: "Boiling House Steam Consumption Per Cane", type: 'DERIVED', calculate: (data) => Number(data.boilingHouseSteamConsumption)*100/(Number(data.totalCaneCrushed)/10) || 0 },
  DMWaterConsumptionPerSteam: { label: "DMWater Consumption Per Steam", type: 'DERIVED', calculate: (data) => Number(data.dmWaterConsumption)*100/Number(data.steamGeneration) || 0 },
  CapacityUtilization: { label: "Capacity Utilization", type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*100/Number(data.PlantCrushingCapacity) || 0 },
  BagasseConsumptionBoiler: { label: "Bagasse Consumption Boiler", type: 'DERIVED', calculate: (data) => Number(data.steamGeneration)*10/Number(data.steamFuelRatio) || 0 },
  BagasseConsumptionRVF: { label: "Bagasse Consumption RVF", type: 'DERIVED', calculate: (data) => Number(data.totalCaneCrushed)*0.8/100 || 0 },
  TotalBagasseConsumption: { label: "Total Bagasse Consumption", type: 'ADDITIVE', calculate: (data) => Number(data.BagasseConsumptionBoiler) + Number(data.BagasseConsumptionRVF) || 0 },
  BagasseSavingCalc: { label: "Bagasse Saving Calc", type: 'ADDITIVE', calculate: (data) => Number(data.BagasseCalc) - Number(data.TotalBagasseConsumption) || 0 },
  BagasseSavingPerCane: { label: "Bagasse Saving Per Cane", type: 'DERIVED', calculate: (data) => Number(data.BagasseSavingCalc)*100/Number(data.totalCaneCrushed) || 0 },
  ExhaustCondensateReturnPerSteam: { label: "Exhaust Condensate Return Per Steam", type: 'DERIVED', calculate: (data) => Number(data.exhaustCondensateReturn)*100 / Number(data.boilingHouseSteamConsumption) || 0 },
  WaterVacuumFilterPerCane: { label: "Water Vacuum Filter Per Cane", type: 'DERIVED', calculate: (data) => Number(data.WaterVacuumFilter)*10*100/Number(data.totalCaneCrushed) || 0 },
  WaterPanA_RefPerCane: { label: "Water Pan A Ref Per Cane", type: 'DERIVED', calculate: (data) => Number(data.WaterPanA_Ref)*10*100/Number(data.totalCaneCrushed) || 0 },
  WaterPanB_CPerCane: { label: "Water Pan B CPer Cane", type: 'DERIVED', calculate: (data) => Number(data.WaterPanB_C)*10*100/Number(data.totalCaneCrushed) || 0 },

  // --- Purity Formulas (Pol * 100 / Brix) — computed on-the-fly, not stored in DB ---
  primaryJuicePty: { label: "Primary Juice Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.primaryJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.primaryJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  MixedJuicePty: { label: "Mixed Juice Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.mixedJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.mixedJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  lastMillJuicePty: { label: "Last Mill Juice Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.lastMillJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.lastMillJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  ClearJuicePty: { label: "Clear Juice Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.clearJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.clearJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  divertedSyrupPty: { label: "Diverted Syrup Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.divertedSyrupBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.divertedSyrupPol) || 0) * 100 / brix).toFixed(2));
  }},
  unsulphuredSyrupPty: { label: "Unsulphured Syrup Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.unsulphuredSyrupBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.unsulphuredSyrupPol) || 0) * 100 / brix).toFixed(2));
  }},
  SulphuredSyrupPty: { label: "Sulphured Syrup Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.sulphuredSyrupBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.sulphuredSyrupPol) || 0) * 100 / brix).toFixed(2));
  }},
  filterJuicePty: { label: "Filter Juice Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.filterJuiceBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.filterJuicePol) || 0) * 100 / brix).toFixed(2));
  }},
  finalMolassesPty: { label: "Final Molasses Pty", type: 'DERIVED', calculate: (data) => {
    const brix = Number(data.finalMolassesBrix) || 0;
    return brix === 0 ? 0 : Number(((Number(data.finalMolassesPol) || 0) * 100 / brix).toFixed(2));
  }},

  // --- Purity Drop/Rise (now correctly resolved via the purity formulas above) ---
  PurityDropPJtoMJ: { label: "Purity Drop PJto MJ", type: 'DERIVED', calculate: (data) => Number(data.primaryJuicePty) - Number(data.MixedJuicePty) || 0 },
  PurityRiseMJtoCJ: { label: "Purity Rise MJto CJ", type: 'DERIVED', calculate: (data) => Number(data.ClearJuicePty) - Number(data.MixedJuicePty) || 0 },
  PurityDropCJtoSyrup: { label: "Purity Drop CJto Syrup", type: 'DERIVED', calculate: (data) => Number(data.ClearJuicePty) - Number(data.SulphuredSyrupPty) || 0 },
  PurityDropPJtoFM: { label: "Purity Drop PJto FM", type: 'DERIVED', calculate: (data) => Number(data.primaryJuicePty) - Number(data.finalMolassesPty) || 0 },
};
