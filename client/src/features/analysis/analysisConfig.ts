export type Typ = 'number' | 'date' | 'time';

export interface CndLgc {
  dpnd: string[];
  evl: (vals: Record<string, unknown>) => boolean;
}

export interface FldCfg {
  id: string;
  lbl: string;
  typ: Typ;
  plc?: string;
  shw?: CndLgc;
}

export interface GrpCfg {
  grpId: string;
  ttl: string;
  desc?: string;
  flds: FldCfg[];
  shw?: CndLgc;
}

export const analysisConfig: GrpCfg[] = [
  {
    grpId: "crushingData",
    ttl: "CRUSHING DATA",
    flds: [
      { id: "plantStartDate", lbl: "Plant Start Date", typ: "date" },
      { id: "plantStartTime", lbl: "Plant Start Time", typ: "time" },
      { id: "plantShutdownDate", lbl: "Plant Shutdown Date", typ: "date" },
      { id: "plantShutdownTime", lbl: "Plant Shutdown Time", typ: "time" },
      { id: "cropDay", lbl: "Cropday", typ: "number" },
      { id: "todayDate", lbl: "Today Date", typ: "date" },
      { id: "rain", lbl: "Rain (Inch)", typ: "number" },
      { id: "tempMax", lbl: "Temperature Max (Deg C)", typ: "number" },
      { id: "tempMin", lbl: "Temperature Min (Deg C)", typ: "number" },
      { id: "humidity", lbl: "Humidity (%)", typ: "number" }
    ]
  },
  {
    grpId: "controlParameters",
    ttl: "CONTROL PARAMETERS",
    flds: [
      { id: "caneCrushed", lbl: "Cane Crushed", typ: "number" },
      { id: "gate", lbl: "Gate", typ: "number" },
      { id: "road", lbl: "Road", typ: "number" },
      { id: "closingBal", lbl: "Closing Bal", typ: "number" },
      { id: "earlyVariety", lbl: "Early Variety", typ: "number" },
      { id: "totalCaneCrushed", lbl: "Total Cane Crushed", typ: "number" },
      { id: "divertedSyrup", lbl: "Diverted Syrup", typ: "number" },
      { id: "molassesSentOut", lbl: "Molasses Sent Out", typ: "number" },
      { id: "imbibition", lbl: "Imbibition", typ: "number" },
      { id: "dirtPercent", lbl: "Dirt %", typ: "number" },
      { id: "filterCakeProduction", lbl: "Filter Cake Production", typ: "number" },
      { id: "grossMixedJuice", lbl: "Gross Mixed Juice", typ: "number" },
      { id: "l31S", lbl: "L 31 (S)", typ: "number" },
      { id: "m31S", lbl: "M 31 (S)", typ: "number" },
      { id: "s31S", lbl: "S 31 (S)", typ: "number" },
      { id: "l31", lbl: "L 31", typ: "number" },
      { id: "m31", lbl: "M 31", typ: "number" },
      { id: "s31", lbl: "S 31", typ: "number" },
      { id: "sSs31Export", lbl: "S/SS 31 (Export)", typ: "number" },
      { id: "rawSugar", lbl: "Raw Sugar", typ: "number" },
      { id: "llBold", lbl: "LL Bold", typ: "number" },
      { id: "brownSugar", lbl: "Brown Sugar", typ: "number" },
      { id: "totalSugarBagged", lbl: "Total Sugar Bagged", typ: "number" }
    ]
  },
  {
    grpId: "reprocess",
    ttl: "REPROCESS",
    flds: [
      { id: "reprocessBrownSugar", lbl: "Brown Sugar", typ: "number" },
      { id: "reprocessRawSugar", lbl: "Raw Sugar", typ: "number" }
    ]
  },
  {
    grpId: "storesConsumption",
    ttl: "STORES CONSUMPTION",
    flds: [
      { id: "lime", lbl: "Lime", typ: "number" },
      { id: "sulphur", lbl: "Sulphur", typ: "number" },
      { id: "ppBags", lbl: "P P Bags", typ: "number" },
      { id: "millSanitationChemicals", lbl: "Mill Sanitation Chemicals", typ: "number" },
      { id: "lubricants", lbl: "Lubricants", typ: "number" },
      { id: "grease", lbl: "Grease", typ: "number" },
      { id: "phosphoricAcid", lbl: "Phosphoric Acid", typ: "number" },
      { id: "colourPrecipitant", lbl: "Colour Precipitant", typ: "number" }
    ]
  },
  {
    grpId: "massecuitesProduction",
    ttl: "MASSECUITES Production",
    flds: [
      { id: "aMassecuite", lbl: "A - Massecuite", typ: "number" },
      { id: "a1Massecuite", lbl: "A1 - Massecuite", typ: "number" },
      { id: "bMassecuite", lbl: "B - Massecuite", typ: "number" },
      { id: "b1Massecuite", lbl: "B1 - Massecuite", typ: "number" },
      { id: "cMassecuite", lbl: "C - Massecuite", typ: "number" },
      { id: "r1Massecuite", lbl: "R1 - Massecuite", typ: "number" },
      { id: "r3Massecuite", lbl: "R3 - Massecuite", typ: "number" },
      { id: "totalMassecuite", lbl: "Total Massecuite", typ: "number" }
    ]
  },
  {
    grpId: "stoppages",
    ttl: "STOPPAGES (Hrs:Min)",
    flds: [
      { id: "stopNoCane", lbl: "No Cane", typ: "time" },
      { id: "stopMechanical", lbl: "Mechanical", typ: "time" },
      { id: "stopElectrical", lbl: "Electrical", typ: "time" },
      { id: "stopInstrumentation", lbl: "Instrumentation", typ: "time" },
      { id: "stopProcess", lbl: "Process", typ: "time" },
      { id: "stopGenCleaning", lbl: "Gen. Cleaning", typ: "time" },
      { id: "stopMiscellaneous", lbl: "Miscellaneous", typ: "time" },
      { id: "totalHoursLost", lbl: "Total Hours Lost", typ: "time" }
    ]
  },
  {
    grpId: "sugarAnalysis",
    ttl: "SUGAR ANALYSIS (M Grade)",
    flds: [
      { id: "sugarColourGs10", lbl: "Sugar Colour GS-10", typ: "number" },
      { id: "sugarColourGs8", lbl: "Sugar Colour GS-8", typ: "number" },
      { id: "sugarReflectance", lbl: "Sugar Reflectance", typ: "number" },
      { id: "moisture", lbl: "Moisture", typ: "number" },
      { id: "particleSizeMa", lbl: "Particle Size MA", typ: "number" },
      { id: "particleSizeCv", lbl: "Particle Size CV", typ: "number" }
    ]
  },
  {
    grpId: "powerData",
    ttl: "POWER DATA",
    flds: [
      { id: "powerGeneration", lbl: "Power Generation", typ: "number" },
      { id: "powerExport", lbl: "Power Export", typ: "number" },
      { id: "powerImport", lbl: "Power Import", typ: "number" },
      { id: "powerConsumption", lbl: "Power Consumption", typ: "number" }
    ]
  },
  {
    grpId: "waterUsage",
    ttl: "WATER USAGE & DISCHARGE",
    flds: [
      { id: "rawWaterConsumption", lbl: "Raw Water Consumption", typ: "number" },
      { id: "treatedWaterDischarge", lbl: "Treated Water Discharge", typ: "number" },
      { id: "treatedWaterRecycled", lbl: "Treated Water Re-cycled", typ: "number" },
      { id: "dmWaterConsumption", lbl: "DM Water Consumption", typ: "number" },
      { id: "steamGeneration", lbl: "Steam Generation", typ: "number" },
      { id: "steamFuelRatio", lbl: "Steam Fuel Ratio", typ: "number" },
      { id: "boilingHouseSteamConsumption", lbl: "Boiling House Steam Consumption", typ: "number" }
    ]
  }
];
