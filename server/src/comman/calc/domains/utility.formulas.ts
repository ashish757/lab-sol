import { FormulaDefinition } from '../types';

export const utilityFormulas: Record<string, FormulaDefinition> = {
  powerGeneration: { label: "Power Generation", type: 'ADDITIVE', calculate: (data) => Number(data.powerGeneration) || 0 },
  powerExport: { label: "Power Export", type: 'ADDITIVE', calculate: (data) => Number(data.powerExport) || 0 },
  powerImport: { label: "Power Import", type: 'ADDITIVE', calculate: (data) => Number(data.powerImport) || 0 },
  powerConsumption: { label: "Power Consumption", type: 'ADDITIVE', calculate: (data) => Number(data.powerConsumption) || 0 },
  
  rawWaterConsumption: { label: "Raw Water Consumption", type: 'ADDITIVE', calculate: (data) => Number(data.rawWaterConsumption) || 0 },
  treatedWaterDischarge: { label: "Treated Water Discharge", type: 'ADDITIVE', calculate: (data) => Number(data.treatedWaterDischarge) || 0 },
  treatedWaterRecycled: { label: "Treated Water Recycled", type: 'ADDITIVE', calculate: (data) => Number(data.treatedWaterRecycled) || 0 },
  dmWaterConsumption: { label: "Dm Water Consumption", type: 'ADDITIVE', calculate: (data) => Number(data.dmWaterConsumption) || 0 },
  steamGeneration: { label: "Steam Generation", type: 'ADDITIVE', calculate: (data) => Number(data.steamGeneration) || 0 },
  steamFuelRatio: { label: "Steam Fuel Ratio", type: 'ADDITIVE', calculate: (data) => Number(data.steamFuelRatio) || 0 },
  PowerHouseSteamConsumption: { label: "Power House Steam Consumption", type: 'ADDITIVE', calculate: (data) => Number(data.PowerHouseSteamConsumption) || 0 },
  boilingHouseSteamConsumption: { label: "Boiling House Steam Consumption", type: 'ADDITIVE', calculate: (data) => Number(data.boilingHouseSteamConsumption) || 0 },
};