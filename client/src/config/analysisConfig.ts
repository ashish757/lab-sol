import { 
  analysisConfig as sharedConfig,
  type InputType as SharedInputType,
  type FieldConfig as SharedFieldConfig,
  type GroupConfig as SharedGroupConfig
} from '../../../shared/analysisFields';

export type InputType = SharedInputType;
export type FieldConfig = SharedFieldConfig;
export type GroupConfig = SharedGroupConfig;

export const analysisConfig: GroupConfig[] = sharedConfig;