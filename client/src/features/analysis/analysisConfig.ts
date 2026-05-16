export type InputType = 'number' | 'date' | 'time';

export interface FieldConfig {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
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
      { id: "cropDay", label: "Cropday", type: "number" },
      { id: "todayDate", label: "Today Date", type: "date" },
      { id: "rain", label: "Rain (Inch)", type: "number" },
      { id: "tempMax", label: "Temperature Max (Deg C)", type: "number" },
      { id: "tempMin", label: "Temperature Min (Deg C)", type: "number" },
      { id: "humidity", label: "Humidity (%)", type: "number" }
    ]
  },
  {
    groupId: "controlParameters",
    title: "CONTROL PARAMETERS",
    fields: [
      { id: "caneCrushed", label: "Cane Crushed", type: "number" },
      { id: "gate", label: "Gate", type: "number" },
      { id: "road", label: "Road", type: "number" },
      { id: "closingBal", label: "Closing Bal", type: "number" },
      { id: "earlyVariety", label: "Early Variety", type: "number" },
      { id: "totalCaneCrushed", label: "Total Cane Crushed", type: "number" },
      { id: "divertedSyrup", label: "Diverted Syrup", type: "number" },
      { id: "molassesSentOut", label: "Molasses Sent Out", type: "number" },
      { id: "imbibition", label: "Imbibition", type: "number" },
      { id: "dirtPercent", label: "Dirt %", type: "number" },
      { id: "filterCakeProduction", label: "Filter Cake Production", type: "number" },
      { id: "grossMixedJuice", label: "Gross Mixed Juice", type: "number" },
      { id: "l31S", label: "L 31 (S)", type: "number" },
      { id: "m31S", label: "M 31 (S)", type: "number" },
      { id: "s31S", label: "S 31 (S)", type: "number" },
      { id: "l31", label: "L 31", type: "number" },
      { id: "m31", label: "M 31", type: "number" },
      { id: "s31", label: "S 31", type: "number" },
      { id: "sSs31Export", label: "S/SS 31 (Export)", type: "number" },
      { id: "rawSugar", label: "Raw Sugar", type: "number" },
      { id: "llBold", label: "LL Bold", type: "number" },
      { id: "brownSugar", label: "Brown Sugar", type: "number" },
      { id: "totalSugarBagged", label: "Total Sugar Bagged", type: "number" }
    ]
  },
  {
    groupId: "reprocess",
    title: "REPROCESS",
    fields: [
      { id: "reprocessBrownSugar", label: "Brown Sugar", type: "number" },
      { id: "reprocessRawSugar", label: "Raw Sugar", type: "number" }
    ]
  },
  {
    groupId: "storesConsumption",
    title: "STORES CONSUMPTION",
    fields: [
      { id: "lime", label: "Lime", type: "number" },
      { id: "sulphur", label: "Sulphur", type: "number" },
      { id: "ppBags", label: "P P Bags", type: "number" },
      { id: "millSanitationChemicals", label: "Mill Sanitation Chemicals", type: "number" },
      { id: "lubricants", label: "Lubricants", type: "number" },
      { id: "grease", label: "Grease", type: "number" },
      { id: "phosphoricAcid", label: "Phosphoric Acid", type: "number" },
      { id: "colourPrecipitant", label: "Colour Precipitant", type: "number" }
    ]
  },
  {
    groupId: "massecuitesProduction",
    title: "MASSECUITES Production",
    fields: [
      { id: "aMassecuite", label: "A - Massecuite", type: "number" },
      { id: "a1Massecuite", label: "A1 - Massecuite", type: "number" },
      { id: "bMassecuite", label: "B - Massecuite", type: "number" },
      { id: "b1Massecuite", label: "B1 - Massecuite", type: "number" },
      { id: "cMassecuite", label: "C - Massecuite", type: "number" },
      { id: "r1Massecuite", label: "R1 - Massecuite", type: "number" },
      { id: "r3Massecuite", label: "R3 - Massecuite", type: "number" },
      { id: "totalMassecuite", label: "Total Massecuite", type: "number" }
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
      { id: "sugarColourGs10", label: "Sugar Colour GS-10", type: "number" },
      { id: "sugarColourGs8", label: "Sugar Colour GS-8", type: "number" },
      { id: "sugarReflectance", label: "Sugar Reflectance", type: "number" },
      { id: "moisture", label: "Moisture", type: "number" },
      { id: "particleSizeMa", label: "Particle Size MA", type: "number" },
      { id: "particleSizeCv", label: "Particle Size CV", type: "number" }
    ]
  },
  {
    groupId: "powerData",
    title: "POWER DATA",
    fields: [
      { id: "powerGeneration", label: "Power Generation", type: "number" },
      { id: "powerExport", label: "Power Export", type: "number" },
      { id: "powerImport", label: "Power Import", type: "number" },
      { id: "powerConsumption", label: "Power Consumption", type: "number" }
    ]
  },
  {
    groupId: "waterUsage",
    title: "WATER USAGE & DISCHARGE",
    fields: [
      { id: "rawWaterConsumption", label: "Raw Water Consumption", type: "number" },
      { id: "treatedWaterDischarge", label: "Treated Water Discharge", type: "number" },
      { id: "treatedWaterRecycled", label: "Treated Water Re-cycled", type: "number" },
      { id: "dmWaterConsumption", label: "DM Water Consumption", type: "number" },
      { id: "steamGeneration", label: "Steam Generation", type: "number" },
      { id: "steamFuelRatio", label: "Steam Fuel Ratio", type: "number" },
      { id: "boilingHouseSteamConsumption", label: "Boiling House Steam Consumption", type: "number" }
    ]
  }
];
