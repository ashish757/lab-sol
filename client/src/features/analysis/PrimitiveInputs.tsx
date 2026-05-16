import { useFormContext } from 'react-hook-form';
import type { Typ } from './analysisConfig';

interface PrimitiveInputProps {
  id: string;
  lbl: string;
  typ: Typ;
}

export const PrimitiveInput = ({ id, lbl, typ }: PrimitiveInputProps) => {
  const { register, formState: { errors } } = useFormContext();

  const getRegisterOptions = () => {
    if (typ === 'number') {
      return { valueAsNumber: true };
    }
    return {};
  };

  const getInputType = () => {
    if (typ === 'text') return 'text';
    if (typ === 'number') return 'number';
    if (typ === 'date') return 'date';
    if (typ === 'time') return 'time';
    return 'text';
  };

  return (
    <div className="flex flex-col mb-3">
      <label htmlFor={id} className="text-xs font-semibold text-slate-700 mb-1 tracking-wide uppercase">
        {lbl}
      </label>
      <input
        id={id}
        type={getInputType()}
        step={typ === 'number' ? 'any' : undefined}
        placeholder={typ === 'text' ? 'HH:MM' : ''}
        {...register(id, getRegisterOptions())}
        className="px-3 py-1.5 border border-slate-300 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white transition-colors hover:border-slate-400"
      />
      {errors[id] && (
        <span className="text-[10px] text-red-500 mt-1 font-medium">
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};
