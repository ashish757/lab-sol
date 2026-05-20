import {
  analysisConfig as sharedConfig,
  type InputType as SharedInputType,
  type FieldConfig as SharedFieldConfig,
  type GroupConfig as SharedGroupConfig,
  type SubGroupConfig as SharedSubGroupConfig,
  type FlatGroupConfig as SharedFlatGroupConfig,
  type ParentGroupConfig as SharedParentGroupConfig,
  isFlatGroup,
  isParentGroup,
  getAllFields,
  getAllSectionIds,
} from '../../../shared/analysisFields';

export type InputType = SharedInputType;
export type FieldConfig = SharedFieldConfig;
export type SubGroupConfig = SharedSubGroupConfig;
export type FlatGroupConfig = SharedFlatGroupConfig;
export type ParentGroupConfig = SharedParentGroupConfig;
export type GroupConfig = SharedGroupConfig;
export { isFlatGroup, isParentGroup, getAllFields, getAllSectionIds };

export const analysisConfig: GroupConfig[] = sharedConfig;