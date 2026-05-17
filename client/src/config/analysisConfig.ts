export type InputType = 'number' | 'date' | 'time';

export interface FieldConfig {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  unit?: string;
  subLabel?: string;
  required?: boolean;
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
      { id: "todayDate", label: "Today Date", type: "date", required: true },
      { id: "cropDay", label: "Cropday", type: "number", unit: "Nos" },
      { id: "rain", label: "Rain (Inch)", type: "number", unit: "Inch" },
      { id: "tempMax", label: "Temperature Max (Deg C)", type: "number", unit: "Deg C" },
      { id: "tempMin", label: "Temperature Min (Deg C)", type: "number", unit: "Deg C" },
      { id: "humidity", label: "Humidity (%)", type: "number", unit: "%" }
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
      { id: "imbibition", label: "Imbibition", type: "number", unit: "%" },
      { id: "dirtPercent", label: "Dirt %", type: "number", unit: "%" },
      { id: "filterCakeProduction", label: "Filter Cake Production", type: "number", unit: "Qtls" },
      { id: "grossMixedJuice", label: "Gross Mixed Juice", type: "number", unit: "%" },
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
      { id: "sugarColourGs10", label: "Sugar Colour GS-10", type: "number", unit: "ICUMSA" },
      { id: "sugarColourGs8", label: "Sugar Colour GS-8", type: "number", unit: "ICUMSA" },
      { id: "sugarReflectance", label: "Sugar Reflectance", type: "number", unit: "%" },
      { id: "moisture", label: "Moisture", type: "number", unit: "%" },
      { id: "particleSizeMa", label: "Particle Size MA", type: "number", unit: "%" },
      { id: "particleSizeCv", label: "Particle Size CV", type: "number", unit: "%" }
    ]
  },
  {
    groupId: "powerData",
    title: "POWER DATA",
    fields: [
      { id: "powerGeneration", label: "Power Generation", type: "number", unit: "KWH" },
      { id: "powerExport", label: "Power Export", type: "number", unit: "KWH" },
      { id: "powerImport", label: "Power Import", type: "number", unit: "KWH" },
      { id: "powerConsumption", label: "Power Consumption", type: "number", unit: "KWH" }
    ]
  },
  {
    groupId: "waterUsage",
    title: "WATER USAGE & DISCHARGE",
    fields: [
      { id: "rawWaterConsumption", label: "Raw Water Consumption", type: "number", unit: "KLtr" },
      { id: "treatedWaterDischarge", label: "Treated Water Discharge", type: "number", unit: "Ltr/MTCane" },
      { id: "treatedWaterRecycled", label: "Treated Water Re-cycled", type: "number", unit: "KLtr" },
      { id: "dmWaterConsumption", label: "DM Water Consumption", type: "number", unit: "%" },
      { id: "steamGeneration", label: "Steam Generation", type: "number", unit: "MT" },
      { id: "steamFuelRatio", label: "Steam Fuel Ratio", type: "number", unit: "%" },
      { id: "boilingHouseSteamConsumption", label: "Boiling House Steam Consumption", type: "number", unit: "%" }
    ]
  },
  {
    groupId: "analysisResults",
    title: "ANALYSIS RESULTS",
    fields: [
      { id: "primaryJuiceBrix", label: "Primary Juice", type: "number", unit: "%", subLabel: "Brix" },
      { id: "primaryJuicePol", label: "Primary Juice", type: "number", unit: "%", subLabel: "Pol" },
      { id: "mixedJuiceBrix", label: "Mixed Juice", type: "number", unit: "%", subLabel: "Brix" },
      { id: "mixedJuicePol", label: "Mixed Juice", type: "number", unit: "%", subLabel: "Pol" },
      { id: "lastMillJuiceBrix", label: "Last Mill Juice ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "lastMillJuicePol", label: "Last Mill Juice", type: "number", unit: "%", subLabel: "Pol" },
      { id: "clearJuiceBrix", label: "Clear Juice", type: "number", unit: "%", subLabel: "Brix" },
      { id: "clearJuicePol", label: "Clear Juice", type: "number", unit: "%", subLabel: "Pol" },
      { id: "divertedSyrupBrix", label: "Diverted Syrup", type: "number", unit: "%", subLabel: "Brix" },
      { id: "divertedSyrupPol", label: "Diverted Syrup", type: "number", unit: "%", subLabel: "Pol" },
      { id: "unsulphuredSyrupBrix", label: "Unsulphured Syrup", type: "number", unit: "%", subLabel: "Brix" },
      { id: "unsulphuredSyrupPol", label: "Unsulphured Syrup", type: "number", unit: "%", subLabel: "Pol" },
      { id: "sulphuredSyrupBrix", label: "Sulphured Syrup ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "sulphuredSyrupPol", label: "Sulphured Syrup", type: "number", unit: "%", subLabel: "Pol" },
      { id: "filterJuiceBrix", label: "Filter Juice ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "filterJuicePol", label: "Filter Juice", type: "number", unit: "%", subLabel: "Pol" },
      { id: "bagassePol", label: "Bagasse: Pol% - Moisture%", type: "number", unit: "%", subLabel: "Brix" },
      { id: "bagasseBrix", label: "Bagasse: Pol% - Moisture%", type: "number", unit: "%", subLabel: "Pol" },
      { id: "filterCakePol", label: "Filter Cake: Pol%", type: "number", unit: "%", subLabel: "Brix" },
      { id: "filterCakeBrix", label: "Filter Cake: Pol%", type: "number", unit: "%", subLabel: "Pol" },
      { id: "aMassecuiteBrix", label: "A - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "aMassecuitePol", label: "A - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "a1MassecuiteBrix", label: "A1 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "a1MassecuitePol", label: "A1 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "bMassecuiteBrix", label: "B - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "bMassecuitePol", label: "B - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "b1MassecuiteBrix", label: "B1 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "b1MassecuitePol", label: "B1 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "cMassecuiteBrix", label: "C - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "cMassecuitePol", label: "C - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "aHeavyMolassesBrix", label: "A - Heavy Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "aHeavyMolassesPol", label: "A - Heavy Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "aLightMolassesBrix", label: "A - Light Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "aLightMolassesPol", label: "A - Light Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "a1HeavyMolassesBrix", label: "A1 - Heavy Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "a1HeavyMolassesPol", label: "A1 - Heavy Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "bHeavyMolassesBrix", label: "B - Heavy Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "bHeavyMolassesPol", label: "B - Heavy Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "b1HeavyMolassesBrix", label: "B1 - Heavy Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "b1HeavyMolassesPol", label: "B1 - Heavy Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "cLightMolassesBrix", label: "C - Light Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "cLightMolassesPol", label: "C - Light Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "finalMolassesBrix", label: "Final Molasses (CH) ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "finalMolassesPol", label: "Final Molasses (CH)", type: "number", unit: "%", subLabel: "Pol" },
      { id: "bCuredSugarBrix", label: "B - Cured Sugar ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "bCuredSugarPol", label: "B - Cured Sugar", type: "number", unit: "%", subLabel: "Pol" },
      { id: "cSingleCuredBrix", label: "C - Single Cured ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "cSingleCuredPol", label: "C - Single Cured", type: "number", unit: "%", subLabel: "Pol" },
      { id: "cDoubleCuredBrix", label: "C - Double Cured ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "cDoubleCuredPol", label: "C - Double Cured", type: "number", unit: "%", subLabel: "Pol" },
      { id: "magmaBrix", label: "Magma ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "magmaPol", label: "Magma", type: "number", unit: "%", subLabel: "Pol" },
      { id: "meltBrix", label: "Melt ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "meltPol", label: "Melt", type: "number", unit: "%", subLabel: "Pol" },
      { id: "rawMeltBrix", label: "Raw Melt ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "rawMeltPol", label: "Raw Melt", type: "number", unit: "%", subLabel: "Pol" },
      { id: "refinedSyrupBrix", label: "Refined Syrup ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "refinedSyrupPol", label: "Refined Syrup", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r1MassecuiteBrix", label: "Refined/R1 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r1MassecuitePol", label: "Refined/R1 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r1MolassesBrix", label: "Refined/R1 - Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r1MolassesPol", label: "Refined/R1 - Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r3MassecuiteBrix", label: "R3 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r3MassecuitePol", label: "R3 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r3MolassesBrix", label: "R3 - Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r3MolassesPol", label: "R3 - Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "sentOutMolassesTrs", label: "Sent Out Molasses (TRS%)", type: "number", unit: "%" },
      { id: "divertedSyrupTrs", label: "Diverted Syrup (TRS%)", type: "number", unit: "%" }
    ]
  }
];