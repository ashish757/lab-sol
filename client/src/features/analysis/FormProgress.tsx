import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { analysisConfig } from './analysisConfig';

const isFilled = (val: any): boolean => {
  if (val === undefined || val === null || val === '') return false;
  if (typeof val === 'number' && isNaN(val)) return false;
  return true;
};

export interface FormProgressProps {
  className?: string;
}

export const FormProgress = React.memo(({ className }: FormProgressProps) => {
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
    <div className={className || "w-full px-6 py-3 select-none flex flex-col gap-2"}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Progress
        </span>
        <span className="text-xs font-black text-slate-700 tabular-nums">
          {filledCount} / {totalFields}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 border border-slate-250/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});
