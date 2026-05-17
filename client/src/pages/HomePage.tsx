import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-slate-200 bg-white shrink-0">
        <span className="text-sm font-semibold text-slate-700 tracking-tight">Enterprise Analytics</span>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Home</Link>
          <Link to="/analysis/new" className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Analysis</Link>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            Sign In
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-500 mb-6">
            <FileText size={12} />
            Daily Production Log System
          </div>

          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-3">
            Enterprise Reporting
          </h1>

          <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            High-accuracy data entry and report generation for internal analysts. Supports 138-field daily production logs.
          </p>

          <Link
            to="/analysis/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors"
          >
            Open Analysis Form
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-slate-100 text-xs text-slate-400 text-center shrink-0">
        Internal use only · Enterprise Analytics v1.0
      </footer>
    </div>
  );
};

