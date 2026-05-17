import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Database, Activity } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">

      <main className="flex-1 max-w-6xl mx-auto px-8 py-12 w-full flex flex-col justify-center gap-10">
        
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white border border-slate-900 shadow-2xl p-8 lg:p-12">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">

            
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-white leading-tight">
              Enterprise Reporting & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">Analytical Calculations</span>
            </h1>
            
            <p className="text-slate-400 text-sm max-w-lg mb-8 leading-relaxed">
              An industry-grade internal tool configured for raw sugarcane production, stores consumption, stoppage metrics.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/analysis/new"
                className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Start Analysing
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
              <Link
                to="/logs"
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition-all cursor-pointer"
              >
                View Historical Logs
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">High-Density Logs</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Enter over 30+ precision parameters with tab-focus acceleration, auto-saving drafts, and client-side schemas.
            </p>
            <Link to="/analysis/new" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
              Start Log <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
              <Database size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Historical Archive</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Access structured historical records instantly. Compare production results, filter metrics, and sync state securely.
            </p>
            <Link to="/logs" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              Browse Logs <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-105 transition-transform">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Real-time Metrics</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Includes auto-computed metrics such as Purity ratios (Pol / Brix) and sugarcane crushing summary calculations.
            </p>
            <span className="text-xs font-semibold text-slate-400 select-none">
              Calculated On-The-Fly
            </span>
          </div>

        </div>

      </main>

    </div>
  );
};

