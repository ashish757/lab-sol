import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { analysisConfig } from './analysisConfig';

const isFilled = (val: any): boolean => {
  if (val === undefined || val === null || val === '') return false;
  if (typeof val === 'number' && isNaN(val)) return false;
  return true;
};

export const FormProgress = React.memo(() => {
  const { control } = useFormContext();
  const values = useWatch({ control }) || {};

  const totalFields = useMemo(() => {
    return analysisConfig.reduce((acc, group) => acc + group.fields.length, 0);
  }, []);

  const filledCount = useMemo(() => {
    let count = 0;
    for (const group of analysisConfig) {
      for (const field of group.fields) {
        const val = values[field.id];
        if (isFilled(val)) {
          count++;
        }
      }
    }
    return count;
  }, [values]);

  const percentage = useMemo(() => {
    if (totalFields === 0) return 0;
    return Math.round((filledCount / totalFields) * 100);
  }, [filledCount, totalFields]);

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 px-6 py-3 select-none flex flex-col gap-2 z-10 flex-shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Data Entry Progress
        </span>
        <span className="text-xs font-bold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-full border border-slate-200/40">
          {filledCount} / {totalFields} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});
