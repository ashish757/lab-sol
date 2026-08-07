import { useEffect } from 'react';
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form';

export interface CalculationConfig {
  targetField: string;
  dependencies: string[];
  calculate: (values: Record<string, any>) => any;
}

const parseNum = (val: any) => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

// Define all calculations in a single configuration array for easy maintenance
export const CALCULATIONS_CONFIG: CalculationConfig[] = [
  {
    targetField: 'cropDay',
    dependencies: ['todayDate', 'seasonStartDate'],
    calculate: (values) => {
      if (values.todayDate && values.seasonStartDate) {
        const start = new Date(values.seasonStartDate);
        const today = new Date(values.todayDate);
        const diffTime = today.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
      }
      return 0;
    },
  },
  {
    targetField: "dayAvaliableHours",
    dependencies: ["dayUnavaliableHours"],
    calculate: (values) => {
      return 24 - parseNum(values.dayUnavaliableHours);
    }
  },
  {
    targetField: "closingBal",
    dependencies: ["caneOpeningBalance", "caneReceived", "caneCrushed" ],
    calculate: (values) => parseNum(values.caneOpeningBalance) + parseNum(values.caneReceived) - parseNum(values.caneCrushed)
    
  },
  {
    targetField: "totalMassecuite",
    dependencies: ["aMassecuite", "a1Massecuite", "bMassecuite", 'b1Massecuite', 'cMassecuite', 'c1Massecuite', 'r1Massecuite', 'r2Massecuite', 'r3Massecuite' ],
    calculate: (values) =>  
      parseNum(values.aMassecuite) +
      parseNum(values.a1Massecuite) +
      parseNum(values.bMassecuite) +
      parseNum(values.b1Massecuite) +
      parseNum(values.cMassecuite) +
      parseNum(values.c1Massecuite) +
      parseNum(values.r1Massecuite) +
      parseNum(values.r2Massecuite) +
      parseNum(values.r3Massecuite)
    
  }, 
  {
    targetField: "totalHoursLost",
    dependencies: ["stopNoCane"],
    calculate: (values) =>
      parseNum(values.stopNoCane) +
      parseNum(values.stopMechanical) +
      parseNum(values.stopElectrical) +
      parseNum(values.stopInstrumentation) +
      parseNum(values.stopProcess) +
      parseNum(values.stopGenCleaning) +
      parseNum(values.stopMiscellaneous)
  },
  {
    targetField: 'totalSugarBagged',
    dependencies: ['rawSugar', 'llBold', 'brownSugar', 's31', 'm31', 'l31', 's30', 'm30', 'l30', 'sSs31Export', 'scrapingSugar'],
    calculate: (values) =>
      parseNum(values.rawSugar) +
      parseNum(values.llBold) +
      parseNum(values.brownSugar) +
      parseNum(values.s30) +
      parseNum(values.m30) +
      parseNum(values.l30) +
      parseNum(values.s31) +
      parseNum(values.m31) +
      parseNum(values.l31) +
      parseNum(values.scrapingSugar) +
      parseNum(values.sSs31Export),
  },
  { 
    targetField: "imbibitionWater",
    dependencies: ["imbibitionWaterRawData", "imbibitionWaterSpecificGavity"],
    calculate: (values) => parseNum(values.imbibitionWaterRawData) * parseNum(values.imbibitionWaterSpecificGavity),
  },
  {
    targetField: "grossMixedJuice",
    dependencies: ["grossMixedJuiceRawData", "mixedJuiceSpecificGravity"],
    calculate: (values) => parseNum(values.grossMixedJuiceRawData) * parseNum(values.imbibitionWater),
  }
];

/**
 * We use useWatch instead of the global watch() function because we only want to subscribe
 * to the specific fields required for these calculations. This isolates component re-renders
 * solely to this hook's local scope rather than re-rendering the entire 160+ field form.
 */
export const useDailyLogCalculations = (
  control: Control<any>,
  setValue: UseFormSetValue<any>
) => {
  // 1. Gather all unique dependencies across all configurations
  const allDependencies = Array.from(
    new Set(CALCULATIONS_CONFIG.flatMap((config) => config.dependencies))
  );

  // 2. Watch all dependencies efficiently with a single useWatch call
  const watchedValuesArray = useWatch({ control, name: allDependencies });

  // 3. Serialize watched values so useEffect safely diffs without infinite loops on array reference changes
  const serializedValues = JSON.stringify(watchedValuesArray);

  useEffect(() => {
    // Map the returned array back to a keyed object
    const valuesObj = allDependencies.reduce((acc, dep, index) => {
      acc[dep] = watchedValuesArray[index];
      return acc;
    }, {} as Record<string, any>);

    // Run all configured calculations
    CALCULATIONS_CONFIG.forEach(({ targetField, calculate }) => {
      const calculatedValue = calculate(valuesObj);
      setValue(targetField, calculatedValue, { shouldValidate: true, shouldDirty: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedValues, setValue]);
};

