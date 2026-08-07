import { FormulaDefinition } from '../types';

export const utilityFormulas: Record<string, FormulaDefinition> = {
  powerGeneration: { type: 'ADDITIVE', calculate: (data) => Number(data.powerGeneration) || 0 },
  powerExport: { type: 'ADDITIVE', calculate: (data) => Number(data.powerExport) || 0 },
  powerImport: { type: 'ADDITIVE', calculate: (data) => Number(data.powerImport) || 0 },
  powerConsumption: { type: 'ADDITIVE', calculate: (data) => Number(data.powerConsumption) || 0 },
  
  rawWaterConsumption: { type: 'ADDITIVE', calculate: (data) => Number(data.rawWaterConsumption) || 0 },
  treatedWaterDischarge: { type: 'ADDITIVE', calculate: (data) => Number(data.treatedWaterDischarge) || 0 },
  treatedWaterRecycled: { type: 'ADDITIVE', calculate: (data) => Number(data.treatedWaterRecycled) || 0 },
  dmWaterConsumption: { type: 'ADDITIVE', calculate: (data) => Number(data.dmWaterConsumption) || 0 },
  steamGeneration: { type: 'ADDITIVE', calculate: (data) => Number(data.steamGeneration) || 0 },
  steamFuelRatio: { type: 'ADDITIVE', calculate: (data) => Number(data.steamFuelRatio) || 0 },
  PowerHouseSteamConsumption: { type: 'ADDITIVE', calculate: (data) => Number(data.PowerHouseSteamConsumption) || 0 },
  boilingHouseSteamConsumption: { type: 'ADDITIVE', calculate: (data) => Number(data.boilingHouseSteamConsumption) || 0 },
};