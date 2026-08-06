import { analysisConfig, getAllFields } from '../../../shared/analysisFields';

export interface ReportFieldOption {
  id: string;
  label: string;
  group: string;
  defaultSelected?: boolean;
}

export const customReportFields: ReportFieldOption[] = [
  // General Session/System Fields
  { id: 'plantName', label: 'Plant Name', group: 'General', defaultSelected: true },
  { id: 'plantCode', label: 'Plant Code', group: 'General', defaultSelected: true },
  { id: 'date', label: 'Date', group: 'General', defaultSelected: true },
  
  // Backend Calculated Metrics
  { id: 'totalCaneCrushed', label: 'Total Cane Crushed', group: 'Backend Calculated' },
  { id: 'totalSugarBagged', label: 'Total Sugar Bagged', group: 'Backend Calculated' },
  { id: 'primaryJuicePurity', label: 'Primary Juice Purity', group: 'Backend Calculated' },
  { id: 'mixedJuicePurity', label: 'Mixed Juice Purity', group: 'Backend Calculated' },
  { id: 'yieldEst', label: 'Yield Est.', group: 'Backend Calculated' },

  // All manual entry and frontend calculated fields
  ...getAllFields(analysisConfig).map(f => ({
    id: f.id,
    label: f.label,
    group: 'Analysis Data'
  }))
];
