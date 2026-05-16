import { useFormContext } from 'react-hook-form';
import type { InputType } from './analysisConfig';

interface PrimitiveInputProps {
  id: string;
  label: string;
  type: InputType;
}

export const PrimitiveInput = ({ id, label, type }: PrimitiveInputProps) => {
  const { register, formState: { errors } } = useFormContext();

  const getRegisterOptions = () => {
    if (type === 'number') {
      return { valueAsNumber: true };
    }
    return {};
  };

  const getInputType = () => {
    if (type === 'number') return 'number';
    if (type === 'date') return 'date';
    if (type === 'time') return 'time';
    return 'text';
  };

  const isDateTime = type === 'date' || type === 'time';
  
  const inputClassName = isDateTime
    ? "p-0 border-none bg-transparent text-blue-700 font-bold text-base shadow-none focus:ring-0 focus:outline-none w-full appearance-none m-0"
    : "px-3 py-1.5 border border-slate-300 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white transition-colors hover:border-slate-400 w-full";

  return (
    <div className="flex flex-col mb-3">
      <label htmlFor={id} className={`text-xs font-semibold text-slate-700 tracking-wide uppercase ${isDateTime ? 'mb-1' : 'mb-1'}`}>
        {label}
      </label>
      <input
        id={id}
        type={getInputType()}
        step={type === 'number' ? 'any' : undefined}
        placeholder={type === 'time' ? 'HH:MM' : ''}
        {...register(id, getRegisterOptions())}
        className={inputClassName}
      />
      {errors[id] && (
        <span className="text-[10px] text-red-500 mt-1 font-medium">
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};
