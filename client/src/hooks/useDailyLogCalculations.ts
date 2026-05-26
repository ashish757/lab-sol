import { useEffect } from 'react';
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form';

/**
 * We use useWatch instead of the global watch() function because we only want to subscribe
 * to the specific fields required for these calculations. This isolates component re-renders
 * solely to this hook's local scope rather than re-rendering the entire 160+ field form.
 */
export const useDailyLogCalculations = (
  control: Control<any>,
  setValue: UseFormSetValue<any>
) => {
  // Watch dates for cropDay calculation
  const todayDate = useWatch({ control, name: 'todayDate' });
  const seasonStartDate = useWatch({ control, name: 'seasonStartDate' });

  // Watch cane fields for totalCaneCrushed
  const gate = useWatch({ control, name: 'gate' });
  const road = useWatch({ control, name: 'road' });

  // Watch sugar fields for totalSugarBagged
  const rawSugar = useWatch({ control, name: 'rawSugar' });
  const llBold = useWatch({ control, name: 'llBold' });
  const brownSugar = useWatch({ control, name: 'brownSugar' });
  const s31 = useWatch({ control, name: 's31' });
  const m31 = useWatch({ control, name: 'm31' });
  const l31 = useWatch({ control, name: 'l31' });
  const sSs31Export = useWatch({ control, name: 'sSs31Export' });

  // Helper to safely parse inputs to numbers
  const parseNum = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  // 1. Calculate Crop Day
  useEffect(() => {
    if (todayDate && seasonStartDate) {
      const start = new Date(seasonStartDate);
      const today = new Date(todayDate);
      
      // Calculate difference in time and convert to days
      const diffTime = today.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day

      if (diffDays > 0) {
        setValue('cropDay', diffDays, { shouldValidate: true, shouldDirty: true });
      } else {
        setValue('cropDay', 0, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [todayDate, seasonStartDate, setValue]);

  // 2. Calculate Total Cane Crushed
  useEffect(() => {
    const calculatedTotalCane = parseNum(gate) + parseNum(road);
    setValue('totalCaneCrushed', calculatedTotalCane, { shouldValidate: true, shouldDirty: true });
  }, [gate, road, setValue]);

  // 3. Calculate Total Sugar Bagged
  useEffect(() => {
    const calculatedTotalSugar =
      parseNum(rawSugar) +
      parseNum(llBold) +
      parseNum(brownSugar) +
      parseNum(s31) +
      parseNum(m31) +
      parseNum(l31) +
      parseNum(sSs31Export);

    setValue('totalSugarBagged', calculatedTotalSugar, { shouldValidate: true, shouldDirty: true });
  }, [rawSugar, llBold, brownSugar, s31, m31, l31, sSs31Export, setValue]);
};
