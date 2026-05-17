export type InputType = 'number' | 'date' | 'time';

export interface FieldConfig {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  unit?: string;
}

export interface GroupConfig {
  groupId: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export const analysisConfig: GroupConfig[] = [
  {
    groupId: "crushingData",
    title: "CRUSHING DATA",
    fields: [
      { id: "plantStartDate", label: "Plant Start Date", type: "date" },
      { id: "plantStartTime", label: "Plant Start Time", type: "time" },
      { id: "plantShutdownDate", label: "Plant Shutdown Date", type: "date" },
      { id: "plantShutdownTime", label: "Plant Shutdown Time", type: "time" },
      { id: "todayDate", label: "Today Date", type: "date" },
      { id: "cropDay", label: "Cropday", type: "number", unit: "Qtls" },
      { id: "rain", label: "Rain (Inch)", type: "number", unit: "Qtls" },
      { id: "tempMax", label: "Temperature Max (Deg C)", type: "number", unit: "Qtls" },
      { id: "tempMin", label: "Temperature Min (Deg C)", type: "number", unit: "Qtls" },
      { id: "humidity", label: "Humidity (%)", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "controlParameters",
    title: "CONTROL PARAMETERS",
    fields: [
      { id: "caneCrushed", label: "Cane Crushed", type: "number", unit: "Qtls" },
      { id: "gate", label: "Gate", type: "number", unit: "Qtls" },
      { id: "road", label: "Road", type: "number", unit: "Qtls" },
      { id: "closingBal", label: "Closing Bal", type: "number", unit: "Qtls" },
      { id: "earlyVariety", label: "Early Variety", type: "number", unit: "Qtls" },
      { id: "totalCaneCrushed", label: "Total Cane Crushed", type: "number", unit: "Qtls" },
      { id: "divertedSyrup", label: "Diverted Syrup", type: "number", unit: "Qtls" },
      { id: "molassesSentOut", label: "Molasses Sent Out", type: "number", unit: "Qtls" },
      { id: "imbibition", label: "Imbibition", type: "number", unit: "Qtls" },
      { id: "dirtPercent", label: "Dirt %", type: "number", unit: "Qtls" },
      { id: "filterCakeProduction", label: "Filter Cake Production", type: "number", unit: "Qtls" },
      { id: "grossMixedJuice", label: "Gross Mixed Juice", type: "number", unit: "Qtls" },
      { id: "l31S", label: "L 31 (S)", type: "number", unit: "Qtls" },
      { id: "m31S", label: "M 31 (S)", type: "number", unit: "Qtls" },
      { id: "s31S", label: "S 31 (S)", type: "number", unit: "Qtls" },
      { id: "l31", label: "L 31", type: "number", unit: "Qtls" },
      { id: "m31", label: "M 31", type: "number", unit: "Qtls" },
      { id: "s31", label: "S 31", type: "number", unit: "Qtls" },
      { id: "sSs31Export", label: "S/SS 31 (Export)", type: "number", unit: "Qtls" },
      { id: "rawSugar", label: "Raw Sugar", type: "number", unit: "Qtls" },
      { id: "llBold", label: "LL Bold", type: "number", unit: "Qtls" },
      { id: "brownSugar", label: "Brown Sugar", type: "number", unit: "Qtls" },
      { id: "totalSugarBagged", label: "Total Sugar Bagged", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "reprocess",
    title: "REPROCESS",
    fields: [
      { id: "reprocessBrownSugar", label: "Brown Sugar", type: "number", unit: "Qtls" },
      { id: "reprocessRawSugar", label: "Raw Sugar", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "storesConsumption",
    title: "STORES CONSUMPTION",
    fields: [
      { id: "lime", label: "Lime", type: "number", unit: "Qtls" },
      { id: "sulphur", label: "Sulphur", type: "number", unit: "Qtls" },
      { id: "ppBags", label: "P P Bags", type: "number", unit: "Qtls" },
      { id: "millSanitationChemicals", label: "Mill Sanitation Chemicals", type: "number", unit: "Qtls" },
      { id: "lubricants", label: "Lubricants", type: "number", unit: "Qtls" },
      { id: "grease", label: "Grease", type: "number", unit: "Qtls" },
      { id: "phosphoricAcid", label: "Phosphoric Acid", type: "number", unit: "Qtls" },
      { id: "colourPrecipitant", label: "Colour Precipitant", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "massecuitesProduction",
    title: "MASSECUITES Production",
    fields: [
      { id: "aMassecuite", label: "A - Massecuite", type: "number", unit: "Qtls" },
      { id: "a1Massecuite", label: "A1 - Massecuite", type: "number", unit: "Qtls" },
      { id: "bMassecuite", label: "B - Massecuite", type: "number", unit: "Qtls" },
      { id: "b1Massecuite", label: "B1 - Massecuite", type: "number", unit: "Qtls" },
      { id: "cMassecuite", label: "C - Massecuite", type: "number", unit: "Qtls" },
      { id: "r1Massecuite", label: "R1 - Massecuite", type: "number", unit: "Qtls" },
      { id: "r3Massecuite", label: "R3 - Massecuite", type: "number", unit: "Qtls" },
      { id: "totalMassecuite", label: "Total Massecuite", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "stoppages",
    title: "STOPPAGES (Hrs:Min)",
    fields: [
      { id: "stopNoCane", label: "No Cane", type: "time" },
      { id: "stopMechanical", label: "Mechanical", type: "time" },
      { id: "stopElectrical", label: "Electrical", type: "time" },
      { id: "stopInstrumentation", label: "Instrumentation", type: "time" },
      { id: "stopProcess", label: "Process", type: "time" },
      { id: "stopGenCleaning", label: "Gen. Cleaning", type: "time" },
      { id: "stopMiscellaneous", label: "Miscellaneous", type: "time" },
      { id: "totalHoursLost", label: "Total Hours Lost", type: "time" }
    ]
  },
  {
    groupId: "sugarAnalysis",
    title: "SUGAR ANALYSIS (M Grade)",
    fields: [
      { id: "sugarColourGs10", label: "Sugar Colour GS-10", type: "number", unit: "Qtls" },
      { id: "sugarColourGs8", label: "Sugar Colour GS-8", type: "number", unit: "Qtls" },
      { id: "sugarReflectance", label: "Sugar Reflectance", type: "number", unit: "Qtls" },
      { id: "moisture", label: "Moisture", type: "number", unit: "Qtls" },
      { id: "particleSizeMa", label: "Particle Size MA", type: "number", unit: "Qtls" },
      { id: "particleSizeCv", label: "Particle Size CV", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "powerData",
    title: "POWER DATA",
    fields: [
      { id: "powerGeneration", label: "Power Generation", type: "number", unit: "Qtls" },
      { id: "powerExport", label: "Power Export", type: "number", unit: "Qtls" },
      { id: "powerImport", label: "Power Import", type: "number", unit: "Qtls" },
      { id: "powerConsumption", label: "Power Consumption", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "waterUsage",
    title: "WATER USAGE & DISCHARGE",
    fields: [
      { id: "rawWaterConsumption", label: "Raw Water Consumption", type: "number", unit: "Qtls" },
      { id: "treatedWaterDischarge", label: "Treated Water Discharge", type: "number", unit: "Qtls" },
      { id: "treatedWaterRecycled", label: "Treated Water Re-cycled", type: "number", unit: "Qtls" },
      { id: "dmWaterConsumption", label: "DM Water Consumption", type: "number", unit: "Qtls" },
      { id: "steamGeneration", label: "Steam Generation", type: "number", unit: "Qtls" },
      { id: "steamFuelRatio", label: "Steam Fuel Ratio", type: "number", unit: "Qtls" },
      { id: "boilingHouseSteamConsumption", label: "Boiling House Steam Consumption", type: "number", unit: "Qtls" }
    ]
  },
  {
    groupId: "analysisResults",
    title: "ANALYSIS RESULTS",
    fields: [
      { id: "primaryJuiceBrix", label: "Primary Juice", type: "number" },
      { id: "primaryJuicePol", label: "Primary Juice", type: "number" },
      { id: "mixedJuiceBrix", label: "Mixed Juice", type: "number" },
      { id: "mixedJuicePol", label: "Mixed Juice", type: "number" },
      { id: "lastMillJuiceBrix", label: "Last Mill Juice ", type: "number" },
      { id: "lastMillJuicePol", label: "Last Mill Juice", type: "number" },
      { id: "clearJuiceBrix", label: "Clear Juice", type: "number" },
      { id: "clearJuicePol", label: "Clear Juice", type: "number" },
      { id: "divertedSyrupBrix", label: "Diverted Syrup", type: "number" },
      { id: "divertedSyrupPol", label: "Diverted Syrup", type: "number" },
      { id: "unsulphuredSyrupBrix", label: "Unsulphured Syrup", type: "number" },
      { id: "unsulphuredSyrupPol", label: "Unsulphured Syrup", type: "number" },
      { id: "sulphuredSyrupBrix", label: "Sulphured Syrup ", type: "number" },
      { id: "sulphuredSyrupPol", label: "Sulphured Syrup", type: "number" },
      { id: "filterJuiceBrix", label: "Filter Juice ", type: "number" },
      { id: "filterJuicePol", label: "Filter Juice", type: "number" },
      { id: "bagassePol", label: "Bagasse: Pol% - Moisture%", type: "number" },
      { id: "bagasseBrix", label: "Bagasse: Pol% - Moisture%", type: "number" },
      { id: "filterCakePol", label: "Filter Cake: Pol%", type: "number" },
      { id: "filterCakeBrix", label: "Filter Cake: Pol%", type: "number" },
      { id: "aMassecuiteBrix", label: "A - Massecuite ", type: "number" },
      { id: "aMassecuitePol", label: "A - Massecuite", type: "number" },
      { id: "a1MassecuiteBrix", label: "A1 - Massecuite ", type: "number" },
      { id: "a1MassecuitePol", label: "A1 - Massecuite", type: "number" },
      { id: "bMassecuiteBrix", label: "B - Massecuite ", type: "number" },
      { id: "bMassecuitePol", label: "B - Massecuite", type: "number" },
      { id: "b1MassecuiteBrix", label: "B1 - Massecuite ", type: "number" },
      { id: "b1MassecuitePol", label: "B1 - Massecuite", type: "number" },
      { id: "cMassecuiteBrix", label: "C - Massecuite ", type: "number" },
      { id: "cMassecuitePol", label: "C - Massecuite", type: "number" },
      { id: "aHeavyMolassesBrix", label: "A - Heavy Molasses ", type: "number" },
      { id: "aHeavyMolassesPol", label: "A - Heavy Molasses", type: "number" },
      { id: "aLightMolassesBrix", label: "A - Light Molasses ", type: "number" },
      { id: "aLightMolassesPol", label: "A - Light Molasses", type: "number" },
      { id: "a1HeavyMolassesBrix", label: "A1 - Heavy Molasses ", type: "number" },
      { id: "a1HeavyMolassesPol", label: "A1 - Heavy Molasses", type: "number" },
      { id: "bHeavyMolassesBrix", label: "B - Heavy Molasses ", type: "number" },
      { id: "bHeavyMolassesPol", label: "B - Heavy Molasses", type: "number" },
      { id: "b1HeavyMolassesBrix", label: "B1 - Heavy Molasses ", type: "number" },
      { id: "b1HeavyMolassesPol", label: "B1 - Heavy Molasses", type: "number" },
      { id: "cLightMolassesBrix", label: "C - Light Molasses ", type: "number" },
      { id: "cLightMolassesPol", label: "C - Light Molasses", type: "number" },
      { id: "finalMolassesBrix", label: "Final Molasses (CH) ", type: "number" },
      { id: "finalMolassesPol", label: "Final Molasses (CH)", type: "number" },
      { id: "bCuredSugarBrix", label: "B - Cured Sugar ", type: "number" },
      { id: "bCuredSugarPol", label: "B - Cured Sugar", type: "number" },
      { id: "cSingleCuredBrix", label: "C - Single Cured ", type: "number" },
      { id: "cSingleCuredPol", label: "C - Single Cured", type: "number" },
      { id: "cDoubleCuredBrix", label: "C - Double Cured ", type: "number" },
      { id: "cDoubleCuredPol", label: "C - Double Cured", type: "number" },
      { id: "magmaBrix", label: "Magma ", type: "number" },
      { id: "magmaPol", label: "Magma", type: "number" },
      { id: "meltBrix", label: "Melt ", type: "number" },
      { id: "meltPol", label: "Melt", type: "number" },
      { id: "rawMeltBrix", label: "Raw Melt ", type: "number" },
      { id: "rawMeltPol", label: "Raw Melt", type: "number" },
      { id: "refinedSyrupBrix", label: "Refined Syrup ", type: "number" },
      { id: "refinedSyrupPol", label: "Refined Syrup", type: "number" },
      { id: "r1MassecuiteBrix", label: "Refined/R1 - Massecuite ", type: "number" },
      { id: "r1MassecuitePol", label: "Refined/R1 - Massecuite", type: "number" },
      { id: "r1MolassesBrix", label: "Refined/R1 - Molasses ", type: "number" },
      { id: "r1MolassesPol", label: "Refined/R1 - Molasses", type: "number" },
      { id: "r3MassecuiteBrix", label: "R3 - Massecuite ", type: "number" },
      { id: "r3MassecuitePol", label: "R3 - Massecuite", type: "number" },
      { id: "r3MolassesBrix", label: "R3 - Molasses ", type: "number" },
      { id: "r3MolassesPol", label: "R3 - Molasses", type: "number" },
      { id: "sentOutMolassesTrs", label: "Sent Out Molasses (TRS%)", type: "number" },
      { id: "divertedSyrupTrs", label: "Diverted Syrup (TRS%)", type: "number" }
    ]
  }
];
