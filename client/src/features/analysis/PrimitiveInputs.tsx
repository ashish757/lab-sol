import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldConfig } from './analysisConfig';

interface BaseInputProps {
  label: string;
  fields: FieldConfig[];
}

interface PrimitiveInputProps extends BaseInputProps {
  groupId?: string;
}

const getFieldUnit = (field: FieldConfig): string => {
  if (field.type === 'date') return 'Date';
  if (field.type === 'time') return 'Time';
  return field.unit || '-';
};

const getInputType = (type: string): string => {
  if (type === 'number') return 'number';
  if (type === 'date') return 'date';
  if (type === 'time') return 'time';
  return 'text';
};

const getRegisterOptions = (type: string) => {
  if (type === 'number') return { valueAsNumber: true };
  return {};
};

const BasePrimitiveInputRow = React.memo(({ label, fields, children }: BaseInputProps & { children?: React.ReactNode }) => {
  const { register } = useFormContext();

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50/40 transition-colors relative group">
      <td className="py-3 pl-4 text-xs font-semibold text-slate-800 tracking-wide uppercase select-none align-middle w-1/3 md:w-1/4 lg:w-1/3">
        <label className="cursor-pointer block">
          {label}
        </label>
      </td>
      <td className="py-3 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest align-middle w-1/4 md:w-1/6 select-none">
        {Array.from(new Set(fields.map(getFieldUnit))).join(' / ')}
      </td>
      <td className="py-3 pr-4 align-middle relative w-auto">
        <div className="flex items-center w-full">
          <div className={`grid gap-4 ${fields.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} flex-1 w-full`}>
            {fields.map(field => {
              const isDateTime = field.type === 'date' || field.type === 'time';
              const inputClassName = isDateTime
                ? "p-0 border-none bg-transparent text-blue-600 font-bold text-base shadow-none focus:ring-0 focus:outline-none appearance-none m-0"
                : "px-3 py-1.5 border border-slate-200 rounded-md text-sm bg-slate-50/50 hover:bg-white hover:border-blue-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 w-full";

              const subLabel = fields.length > 1 ? field.subLabel : '';

              return (
                <div key={field.id} className="relative w-full flex items-center">
                  {subLabel && (
                    <span className="text-[10px] font-black text-slate-500 mr-3 uppercase tracking-wider w-14 text-right select-none">
                      {subLabel}
                    </span>
                  )}
                    <input
                      id={field.id}
                      type={getInputType(field.type)}
                      step={field.type === 'number' ? 'any' : undefined}
                      placeholder={field.type === 'time' ? 'HH:MM' : ''}
                      {...register(field.id, getRegisterOptions(field.type))}
                      className={inputClassName}
                    />
                </div>
              );
            })}
          </div>
          {children}
        </div>
      </td>
    </tr>
  );
});

const RatioCalculatedInput = React.memo(({ label, fields }: BaseInputProps) => {
  const { control } = useFormContext();

  const fieldIds = fields.map(f => f.id);
  const watchedValues = useWatch({
    control,
    name: fieldIds,
  });

  const brixIndex = fields.findIndex(f => f.id.toLowerCase().includes('brix'));
  const polIndex = fields.findIndex(f => f.id.toLowerCase().includes('pol'));
  
  if (brixIndex === -1 || polIndex === -1) {
    return <BasePrimitiveInputRow label={label} fields={fields} />;
  }

  const brixVal = watchedValues[brixIndex];
  const polVal = watchedValues[polIndex];

  const brix = typeof brixVal === 'number' ? brixVal : parseFloat(brixVal as string);
  const pol = typeof polVal === 'number' ? polVal : parseFloat(polVal as string);

  let ratioText = '—';
  if (!isNaN(brix) && !isNaN(pol) && brix !== 0) {
    ratioText = (pol / brix).toFixed(2);
  }

  return (
    <BasePrimitiveInputRow label={label} fields={fields}>
      <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center ml-6 pl-6 border-l border-slate-200 select-none">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Purity</span>
        <span className="text-xs font-black text-emerald-800 bg-emerald-55  px-3 py-1.5 rounded-lg border-1 border-emerald-200 min-w-[3.5rem] text-center select-all">
          {ratioText}
        </span>
      </div>
    </BasePrimitiveInputRow>
  );
});

export const PrimitiveInput = React.memo(({ label, fields, groupId }: PrimitiveInputProps) => {
  if (groupId === 'analysisResults') {
    return <RatioCalculatedInput label={label} fields={fields} />;
  }
  return <BasePrimitiveInputRow label={label} fields={fields} />;
});
