export type InputType = 'number' | 'date' | 'time' | 'text';

export interface FieldConfig {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  unit?: string;
  subLabel?: string;
  required?: boolean;
  isCalculated?: boolean;
  readonly?: boolean;
}

export interface SubGroupConfig {
  subGroupId: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface FlatGroupConfig {
  groupId: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface ParentGroupConfig {
  groupId: string;
  title: string;
  description?: string;
  subGroups: SubGroupConfig[];
}

export type GroupConfig = FlatGroupConfig | ParentGroupConfig;

export const isFlatGroup = (g: GroupConfig): g is FlatGroupConfig => 'fields' in g;
export const isParentGroup = (g: GroupConfig): g is ParentGroupConfig => 'subGroups' in g;

export const getAllFields = (config: GroupConfig[]): FieldConfig[] =>
  config.flatMap((g) =>
    isFlatGroup(g) ? g.fields : g.subGroups.flatMap((sg) => sg.fields)
  );

export const getAllSectionIds = (config: GroupConfig[]): string[] =>
  config.flatMap((g) =>
    isFlatGroup(g) ? [g.groupId] : g.subGroups.map((sg) => sg.subGroupId)
  );

export const analysisConfig: GroupConfig[] = [
  {
    groupId: "seasonStartAndOff",
    title: "SEASON TIME ACCOUNT",
    fields: [
      { id: "seasonStartDate", label: "Season Start Date", type: "date", readonly: true },
      { id: "seasonStartTime", label: "Season Start Time", type: "time", readonly: true },
      { id: "seasonOffDate", label: "Season Off Date", type: "date", readonly: true },
      { id: "seasonOffTime", label: "Season Off Time", type: "time", readonly: true },
      { id: "dayStartTime", label: "Day Start Time", type: "time", readonly: true },
      { id: "todayDate", label: "Today Date", type: "date", required: true, readonly: true },
      { id: "cropDay", label: "Crop day", type: "number", unit: "Nos", isCalculated: true },
      { id: "dayUnavaliableHours", label: "Day Unavaliable Hours", type: "number", unit: "HH:MM" },
    ]
  },
  {
    groupId: "WeatherData",
    title: "WEATHER STATUS",
    fields: [
      { id: "rain", label: "Rain", type: "number", unit: "Inch" },
      { id: "tempMax", label: "Temperature Max", type: "number", unit: "Deg C" },
      { id: "tempMin", label: "Temperature Min", type: "number", unit: "Deg C" },
      { id: "weatherCondition", label: "Weather Condition", type: "text", unit: "-" },
      { id: "humidity", label: "Humidity", type: "number", unit: "%" }
    ]
  },
  {
    groupId: "CaneCrushing",
    title: "CANE CRUSHING DATA",
    fields: [
      { id: "caneOpeningBalance", label: "Cane Opening Balance", type: "number", unit: "Qtls" },
      { id: "caneReceived", label: "Cane Received", type: "number", unit: "Qtls" },
      { id: "gate", label: "Gate", type: "number", unit: "Qtls" },
      { id: "road", label: "Road/Center", type: "number", unit: "Qtls" },
      { id: "caneCrushed", label: "Cane Crushed", type: "number", unit: "Qtls", isCalculated: true },
      { id: "closingBal", label: "Closing Balance", type: "number", unit: "Qtls" },
      { id: "earlyVariety", label: "Early Variety", type: "number", unit: "Qtls" },
      { id: "yardBalance", label: "Yard Balance", type: "number", unit: "Qtls" },
      { id: "divertedSyrup", label: "Diverted Syrup", type: "number", unit: "Qtls" },
      { id: "molassesSentOut", label: "Final Molasses Sent Out", type: "number", unit: "Qtls" },
      { id: "imbibitionWaterRawData", label: "Imbibition Water Raw Data", type: "number", unit: "Qtls" },
      { id: "imbibitionWaterSpecificGavity", label: "Imbibition Water Sp. Gravity", type: "number", unit: "-" },
      { id: "dirtPercent", label: "Dirt %", type: "number", unit: "% Cane" },
      { id: "unknownLosses", label: "unknownLosses", type: "number", unit: "% MJ" },
      { id: "polPercentSugar", label: "Pol Percent Sugar", type: "number", unit: "%" },
      { id: "filterCakeProduction", label: "Filter Cake Production", type: "number", unit: "Qtls" },
      { id: "grossMixedJuiceRawData", label: "Gross Mixed Juice Raw Data", type: "number", unit: "Qtls" },
      { id: "mixedJuiceSpecificGravity", label: "Mixed Juice Sp. Gravity", type: "number", unit: "Qtls MJ" },
      

      
    ]
  },
  {
    groupId: "sugarProductionData",
    title: "Sugar Production Data",
    fields: [
      { id: "l30", label: "L 30", type: "number", unit: "Qtls" },
      { id: "m30", label: "M 30", type: "number", unit: "Qtls" },
      { id: "s30", label: "S 30", type: "number", unit: "Qtls" },
      { id: "l31", label: "L 31", type: "number", unit: "Qtls" },
      { id: "m31", label: "M 31", type: "number", unit: "Qtls" },
      { id: "s31", label: "S 31", type: "number", unit: "Qtls" },
      { id: "sSs31Export", label: "S/SS 31 (Export)", type: "number", unit: "Qtls" },
      { id: "rawSugar", label: "Raw Sugar", type: "number", unit: "Qtls" },
      { id: "llBold", label: "LL Bold", type: "number", unit: "Qtls" },
      { id: "brownSugar", label: "Brown Sugar", type: "number", unit: "Qtls" },
      { id: "scrapingSugar", label: "Scraping Sugar", type: "number", unit: "Qtls" },
      { id: "totalSugarBagged", label: "Total Sugar Bagged", type: "number", unit: "Qtls", isCalculated: true }
    ]
  },

  {
    groupId: "sugarReprocess",
    title: "SUGAR REPROCESS DATA",
    fields: [
      { id: "remaltingWhiteSugar", label: "Remalting White Sugar", type: "number", unit: "Qtls" },
      { id: "reprocessBrownSugar", label: "Reproce Brown Sugar", type: "number", unit: "Qtls" },
      { id: "reprocessRawSugar", label: "Reproce Raw Sugar", type: "number", unit: "Qtls" },
      { id: "reprocessScrapSugar", label: "Reproce Scraping Sugar", type: "number", unit: "Qtls" },
      { id: "remaltingWhiteSugarBrix", label: "Remalting White Sugar Analysis", type: "number", unit: "%", subLabel: "Brix" },
      { id: "remaltingWhiteSugarPol", label: "Remalting White Sugar Analysis", type: "number", unit: "%", subLabel: "Pol" },

      { id: "reprocessBrownSugarBrix", label: "Reproce Brown Sugar Analysis", type: "number", unit: "%", subLabel: "Brix" },
      { id: "reprocessBrownSugarPol", label: "Reroce Brown Sugar Analysis", type: "number", unit: "%", subLabel: "Pol" },

      { id: "reprocessRawSugarBrix", label: "Reproce Raw Sugar Analysis", type: "number", unit: "%", subLabel: "Brix" },
      { id: "reprocessRawSugarPol", label: "Reroce Raw Sugar Analysis", type: "number", unit: "%", subLabel: "Pol" },

       { id: "reprocessScrapingSugarBrix", label: "Reproce Scraping Sugar Analysis", type: "number", unit: "%", subLabel: "Brix" },
      { id: "reprocessScrapingSugarPol", label: "Reroce Scraping Sugar Analysis", type: "number", unit: "%", subLabel: "Pol" }

      
    ]
  },
  {
    groupId: "storesConsumption",
    title: "STORES CONSUMPTION",
    fields: [
      { id: "lime", label: "Lime", type: "number", unit: "Qtls" },
      { id: "sulphur", label: "Sulphur", type: "number", unit: "Qtls" },
      { id: "ppBags", label: "P P Bags", type: "number", unit: "Nos." },
      { id: "millSanitationChemicals", label: "Mill Sanitation Chemicals", type: "number", unit: "Kgs" },
      { id: "lubricants", label: "Lubricants", type: "number", unit: "Lts" },
      { id: "grease", label: "Grease", type: "number", unit: "Kgs" },
      { id: "phosphoricAcid", label: "Phosphoric Acid", type: "number", unit: "Kgs" },
      { id: "colourPrecipitant", label: "Colour Precipitant", type: "number", unit: "Kgs" }
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
      { id: "c1Massecuite", label: "C1 - Massecuite", type: "number", unit: "Qtls" },
      { id: "r1Massecuite", label: "R1 - Massecuite", type: "number", unit: "Qtls" },
      { id: "r2Massecuite", label: "R2 - Massecuite", type: "number", unit: "Qtls" },
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
    groupId: "sugarAnalysisLGrade",
    title: "SUGAR ANALYSIS (L Grade)",
    fields: [
      { id: "l31sugarColourGs10", label: "L-31 Sugar Colour GS-10", type: "number", unit: "IU" },
      { id: "l31sugarColourGs8", label: "L-31 Sugar Colour GS-8", type: "number", unit: "IU" },
      { id: "l31sugarReflectance", label: "L-31 Sugar Reflectance", type: "number", unit: "%" },
      { id: "l31moisture", label: "L-31 Sugar Moisture", type: "number", unit: "%" },
      { id: "l31particleSizeMa", label: "L-31 Sugar MA", type: "number", unit: "mm" },
      { id: "l31particleSizeCv", label: "L-31 Sugar CV", type: "number", unit: "%" },
      { id: "llBoldColour", label: "LL Bold Colour", type: "number", unit: "IU" },
       { id: "l30sugarColourGs10", label: "L-30 Sugar Colour GS-10", type: "number", unit: "IU" },

    ]
  },
  {
    groupId: "sugarAnalysisMGrade",
    title: "SUGAR ANALYSIS (M Grade)",
    fields: [
      { id: "m31SugarColourGs10", label: "M-31 Sugar Colour GS-10", type: "number", unit: "IU" },
      { id: "m31SugarColourGs8", label: "M-31 Sugar Colour GS-8", type: "number", unit: "IU" },
      { id: "m31SugarReflectance", label: "M-31 Sugar Reflectance", type: "number", unit: "%" },
      { id: "m31Moisture", label: "M-31 Sugar Moisture", type: "number", unit: "%" },
      { id: "m31ParticleSizeMa", label: "M-31 Sugar MA", type: "number", unit: "mm" },
      { id: "m31ParticleSizeCv", label: "M-31 Sugar CV", type: "number", unit: "%" },
       { id: "m30SugarColourGs10", label: "M-30 Sugar Colour GS-10", type: "number", unit: "IU" },
    ]
  },
  {
    groupId: "sugarAnalysisSGrade",
    title: "SUGAR ANALYSIS (S Grade)",
    fields: [
      { id: "s31SugarColourGs10", label: "S-31 Sugar Colour GS-10", type: "number", unit: "IU" },
      { id: "s31SugarColourGs8", label: "S-31 Sugar Colour GS-8", type: "number", unit: "IU" },
      { id: "s31SugarReflectance", label: "S-31 Sugar Reflectance", type: "number", unit: "%" },
      { id: "s31Moisture", label: "S-31 Sugar Moisture", type: "number", unit: "%" },
      { id: "s31particleSizeMa", label: "S-31 Sugar MA", type: "number", unit: "mm" },
      { id: "s31particleSizeCv", label: "S-31 Sugar CV", type: "number", unit: "%" },
      { id: "s30SugarColourGs10", label: "S-30 Sugar Colour GS-10", type: "number", unit: "IU" },
    ]
  },

  {
    groupId: "rawSugarAnalysis",
    title: "RAW SUGAR ANALYSIS",
    fields: [
      { id: "rawSugarColourGs-10", label: "Raw Sugar Colour GS-10", type: "number", unit: "IU" },
      { id: "rawSugarMoisture", label: "Raw Sugar Moisture", type: "number", unit: "%" },
      { id: "rawSugarMA", label: "Raw Sugar MA", type: "number", unit: "mm" },
      { id: "rawSugarCV", label: "Raw Sugar CV", type: "number", unit: "%" },

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
    title: "STEAM, WATER USAGE & DISCHARGE",
    fields: [
      { id: "rawWaterConsumption", label: "Raw Water Consumption", type: "number", unit: "KLtr" },
      { id: "treatedWaterDischarge", label: "Treated Water Discharge", type: "number", unit: "Ltr/MTCane" },
      { id: "treatedWaterRecycled", label: "Treated Water Re-cycled", type: "number", unit: "KLtr" },
      { id: "dmWaterConsumption", label: "DM Water Consumption", type: "number", unit: "KLtr" },
      { id: "steamGeneration", label: "Steam Generation", type: "number", unit: "MT" },
      { id: "steamFuelRatio", label: "Steam Fuel Ratio", type: "number", unit: "%" },
      { id: "powerHouseSteamConsumption", label: "Power House Steam Consumption", type: "number", unit: "MT" },
      { id: "boilingHouseSteamConsumption", label: "Boiling House Steam Consumption", type: "number", unit: "MT" }
    ]
  },
  {
    groupId: "analysisResults",
    title: "ROUTINE ANALYSIS",
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

      { id: "bagasseMoisture", label: "Bagasse: Moisture%", type: "number", unit: "%" },
      { id: "bagassePol", label: "Bagasse: Pol%", type: "number", unit: "%" },

      { id: "filterCakeMoisture", label: "Filter Cake: Moisture%", type: "number", unit: "%"},
      { id: "filterCakePol", label: "Filter Cake: Pol%", type: "number", unit: "%" },
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
      { id: "c1MassecuiteBrix", label: "C1 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "c1MassecuitePol", label: "C1 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
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
       { id: "c1HeavyMolassesBrix", label: "C1 - Heavy Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "c1HeavyMolassesPol", label: "C1 - Heavy Molasses", type: "number", unit: "%", subLabel: "Pol" },
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
      { id: "bAndCMeltBrix", label: "B & C Melt ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "bAndCMeltPol", label: "B & C Melt", type: "number", unit: "%", subLabel: "Pol" },
      { id: "rawMeltBrix", label: "Raw Melt ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "rawMeltPol", label: "Raw Melt", type: "number", unit: "%", subLabel: "Pol" },
      { id: "refinedSyrupBrix", label: "Refined Syrup/Melt ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "refinedSyrupPol", label: "Refined Syrup/Melt", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r1MassecuiteBrix", label: "Refined/R1 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r1MassecuitePol", label: "Refined/R1 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r1MolassesBrix", label: "Refined/R1 - Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r1MolassesPol", label: "Refined/R1 - Molasses", type: "number", unit: "%", subLabel: "Pol" },
       { id: "r2MassecuiteBrix", label: "R2 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r2MassecuitePol", label: "R2 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r2MolassesBrix", label: "R2 - Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r2MolassesPol", label: "R2 - Molasses", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r3MassecuiteBrix", label: "R3 - Massecuite ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r3MassecuitePol", label: "R3 - Massecuite", type: "number", unit: "%", subLabel: "Pol" },
      { id: "r3MolassesBrix", label: "R3 - Molasses ", type: "number", unit: "%", subLabel: "Brix" },
      { id: "r3MolassesPol", label: "R3 - Molasses", type: "number", unit: "%", subLabel: "Pol" },
      
    ]
  },
  {
    groupId: "specialAnalysisGroup",
    title: "SPECIAL ANALYSIS",
    subGroups: [
      {
        subGroupId: "specialanalysisResults",
        title: "TRS ANALYSIS RESULTS",
        fields: [
          { id: "divertedSyrupTrs", label: "Diverted Syrup TRS", type: "number", unit: "%" },
          { id: "BheavyMolassesTrs", label: "B-Heavy Molasses TRS", type: "number", unit: "%" },
          { id: "FinalMolassesTrs", label: "Final Molasses TRS", type: "number", unit: "%" },
        ]
      },
      {
        subGroupId: "SucrosePurityAnalysisResults",
        title: "SUCROSE PURITY ANALYSIS RESULTS",
        fields: [
          { id: "MJSucrosePurity", label: "Mixed Juice Sucrose Purity", type: "number", unit: "%" }
        ]
      },
      {
        subGroupId: "rsanalysisResults",
        title: "RS ANALYSIS RESULTS",
        fields: [
          { id: "rsPrimaryJuice", label: "Primary Juice", type: "number", unit: "Per 100 Bx" },
          { id: "rsMixedJuice", label: "Mixed Juice", type: "number", unit: "Per 100 Bx" },
          { id: "rsClearJuice", label: "Clear Juice", type: "number", unit: "Per 100 Bx" },
          { id: "rsUnSulSyrup", label: "Un Sulphured Syrup", type: "number", unit: "Per 100 Bx" },
          { id: "rsSulSyrup", label: "Sulphured Syrup", type: "number", unit: "Per 100 Bx" },
          { id: "rsFinalMolasses", label: "Final Molasses", type: "number", unit: "Per 100 Bx" }
        ]
      },
      {
        subGroupId: "coluoranalysisResults",
        title: "COLOUR ANALYSIS RESULTS",
        fields: [
          { id: "primaryJuiceColour", label: "Primary Juice Colour", type: "number", unit: "IU" },
          { id: "mixedJuiceColour", label: "Mixed Juice Colour", type: "number", unit: "IU" },
          { id: "clearJuiceColour", label: "Clear Juice Colour", type: "number", unit: "IU" },
          { id: "unSulphuredSyrupColour", label: "Un Sulphured Syrup Colour", type: "number", unit: "IU" },
          { id: "sulphuredSyrupColour", label: "Sulphured Syrup Colour", type: "number", unit: "IU" },
          { id: "aMassecuiteColour", label: "A-Massecuite Colour", type: "number", unit: "IU" },
          { id: "aLightColour", label: "A-Light Colour", type: "number", unit: "IU" },
          { id: "aHeavyColour", label: "A-Heavy Colour", type: "number", unit: "IU" },
          { id: "bMassecuiteColour", label: "B-Massecuite Colour", type: "number", unit: "IU" },
          { id: "bHeavyColour", label: "B-Heavy Colour", type: "number", unit: "IU" },
          { id: "bSugarSolour", label: "B-Sugar Colour", type: "number", unit: "IU" },
          { id: "cMassecuite", label: "C-Massecuite", type: "number", unit: "IU" },
          { id: "CFWsugar", label: "CFW Sugar", type: "number", unit: "IU" },
          { id: "CAWsugar", label: "CAW Sugar", type: "number", unit: "IU" },
          { id: "cLightColour", label: "C-Light Colour", type: "number", unit: "IU" },
          { id: "finalMolassesColour", label: "Final Molasses Colour", type: "number", unit: "IU" },
        ]
      },
    ]
  },
];