import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analysisSchema, type AnalysisSchema } from '../../types/analysisSchema';

export const AnalysisForm = () => {
  const form = useForm<AnalysisSchema>({
    resolver: zodResolver(analysisSchema),
  });

  const onSubmit = (data: AnalysisSchema) => {
    console.log(data);
  };

  const fields = Array.from({ length: 20 }, (_, i) => `analysisField${i + 1}` as keyof AnalysisSchema);

  return (
    <div className="bg-white shadow-sm rounded-md border border-slate-200 p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Analysis Data Entry</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((field) => (
            <div key={field} className="flex flex-col space-y-1">
              <label htmlFor={field} className="text-sm font-medium text-slate-700">
                {field}
              </label>
              <input
                id={field}
                type="number"
                {...form.register(field, { valueAsNumber: true })}
                className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50 transition-colors"
              />
              {form.formState.errors[field] && (
                <span className="text-xs text-red-500">
                  {form.formState.errors[field]?.message}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Run Analysis
          </button>
        </div>
      </form>
    </div>
  );
};
