import { AnalysisForm } from '../features/analysis/AnalysisForm';

export const AnalysisPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Analysis</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter required parameters to run proprietary calculations and generate enterprise reports.
          </p>
        </div>
        <AnalysisForm />
      </div>
    </div>
  );
};
