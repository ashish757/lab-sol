import { FormulaDefinition } from './types';

import { sugarProductionFormulas } from './domains/sugar.formulas';
import { storesConsumptionFormulas } from './domains/stores.formulas';
import {manufacturingFormulas} from './domains/manufacturing.formulas'
import {massecuitesAndStoppagesFormulas} from './domains/stoppages.formulas';
import {utilityFormulas} from './domains/utility.formulas';
import { sugarAnalysisLGradeFormulas } from './domains/sugarAnalysis.formulas';
import {routineAnalysisFormulas} from './domains/routine.formulas';
import { specialAnalysisFormulas } from './domains/specialAnalysis.formulas';


export const FormulaRegistry: Record<string, FormulaDefinition> = {
  ...sugarProductionFormulas,
  ...manufacturingFormulas,
  ...storesConsumptionFormulas,
  ...massecuitesAndStoppagesFormulas,
  ...utilityFormulas,
  ...sugarAnalysisLGradeFormulas,
  ...routineAnalysisFormulas, 
  ...specialAnalysisFormulas,
};
