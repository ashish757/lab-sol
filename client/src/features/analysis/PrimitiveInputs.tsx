import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldConfig } from './analysisConfig';

interface PrimitiveInputProps {
  label: string;
  fields: FieldConfig[];
  groupId?: string;
}

export const PrimitiveInput = ({ label, fields, groupId }: PrimitiveInputProps) => {
  const { register, formState: { errors }, control } = useFormContext();

  const fieldIds = fields.map(f => f.id);
  const watchedValues = useWatch({
    control,
    name: fieldIds,
  });

  const getRatioDisplay = () => {
    if (groupId !== 'analysisResults') return null;
    
    const brixIndex = fields.findIndex(f => f.id.toLowerCase().includes('brix'));
    const polIndex = fields.findIndex(f => f.id.toLowerCase().includes('pol'));
    
    if (brixIndex === -1 || polIndex === -1) return null;

    const brixVal = watchedValues[brixIndex];
    const polVal = watchedValues[polIndex];

    const brix = typeof brixVal === 'number' ? brixVal : parseFloat(brixVal as string);
    const pol = typeof polVal === 'number' ? polVal : parseFloat(polVal as string);

    let ratioText = '-';
    if (!isNaN(brix) && !isNaN(pol) && brix !== 0) {
      ratioText = (pol / brix).toFixed(2);
    }

    return (
      <div className="w-16 flex-shrink-0 flex flex-col items-center justify-center ml-4 pl-4 border-l border-slate-200">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purity</span>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {ratioText}
        </span>
      </div>
    );
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors relative group">
      <td className="py-3 pl-4 text-xs font-semibold text-slate-600 tracking-wide uppercase select-none align-middle w-1/3 md:w-1/4 lg:w-1/3">
        <label className="cursor-pointer block">
          {label}
        </label>
      </td>
      <td className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider align-middle w-1/4 md:w-1/6">
        {Array.from(new Set(fields.map(f => {
          const isDateTime = f.type === 'date' || f.type === 'time';
          return isDateTime ? (f.type === 'date' ? 'Date' : 'Time') : (f.unit || '-');
        }))).join(' / ')}
      </td>
      <td className="py-3 pr-4 align-middle relative w-auto">
        <div className="flex items-center w-full">
          <div className={`grid gap-4 ${fields.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} flex-1 w-full`}>
            {fields.map(field => {
              const isDateTime = field.type === 'date' || field.type === 'time';
              const inputClassName = isDateTime
                ? "p-0 border-none bg-transparent text-blue-700 font-bold text-base shadow-none focus:ring-0 focus:outline-none w-full appearance-none m-0"
                : "px-3 py-1.5 border border-slate-300 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white transition-colors hover:border-slate-400 w-full";

              const subLabel = fields.length > 1 ? (field.id.match(/[A-Z][a-z]*$/)?.[0] || field.id) : '';

              const getRegisterOptions = () => {
                if (field.type === 'number') return { valueAsNumber: true };
                return {};
              };

              const getInputType = () => {
                if (field.type === 'number') return 'number';
                if (field.type === 'date') return 'date';
                if (field.type === 'time') return 'time';
                return 'text';
              };

              return (
                <div key={field.id} className="relative w-full flex items-center">
                  {subLabel && <span className="text-[10px] font-bold text-slate-400 mr-3 uppercase tracking-wider w-16 text-right select-none">{subLabel}</span>}
                  <div className="relative w-full">
                    <input
                      id={field.id}
                      type={getInputType()}
                      step={field.type === 'number' ? 'any' : undefined}
                      placeholder={field.type === 'time' ? 'HH:MM' : ''}
                      {...register(field.id, getRegisterOptions())}
                      className={inputClassName}
                    />
                    {errors[field.id] && (
                      <span className="absolute -bottom-4 left-0 text-[10px] text-red-500 font-medium">
                        {errors[field.id]?.message as string}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {getRatioDisplay()}
        </div>
      </td>
    </tr>
  );
};
