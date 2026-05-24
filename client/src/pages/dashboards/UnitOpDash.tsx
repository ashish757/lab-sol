import { useSelector } from 'react-redux';
import { useGetUnitByIdQuery, useGetDailyLogsQuery } from '../../store/api/apiSlice';
import type { RootState } from '../../store/store';
import { ShieldCheck, Network, ArrowRight, Activity, TrendingUp, Calendar, CalendarDays, RefreshCw, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PAGES, getPagePath } from '../../config/routesConfig';
import type { DailyLogResponse } from '../../types/dailyLogs';

export const UnitOpDash = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: unit, isLoading: unitLoading } = useGetUnitByIdQuery(user?.unitId as string, {
    skip: !user?.unitId,
  });
  
  const { data: logs = [], isLoading: logsLoading, isError, refetch } = useGetDailyLogsQuery({});

  const totalCane = logs.reduce((acc: number, log: DailyLogResponse) => {
    const metrics = typeof log.metrics === 'string' ? JSON.parse(log.metrics) : log.metrics;
    return acc + (parseFloat(metrics?.caneCrushed) || 0);
  }, 0);

  const totalSugar = logs.reduce((acc: number, log: DailyLogResponse) => {
    const metrics = typeof log.metrics === 'string' ? JSON.parse(log.metrics) : log.metrics;
    return acc + (parseFloat(metrics?.totalSugarBagged) || 0);
  }, 0);

  let puritySum = 0;
  let purityCount = 0;
  logs.forEach((log: DailyLogResponse) => {
    const metrics = typeof log.metrics === 'string' ? JSON.parse(log.metrics) : log.metrics;
    const brix = parseFloat(metrics?.primaryJuiceBrix) || 0;
    const pol = parseFloat(metrics?.primaryJuicePol) || 0;
    if (brix > 0) {
      puritySum += (pol / brix) * 100;
      purityCount++;
    }
  });
  const avgPurity = purityCount > 0 ? (puritySum / purityCount).toFixed(2) : '—';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-slate-50">
      <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
        <main className="max-w-6xl mx-auto px-8 py-10 w-full flex-1 flex flex-col gap-8">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white border border-slate-900 shadow-2xl p-6 lg:p-8">
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    {unitLoading ? 'Loading...' : (unit?.org?.name || 'Unknown Organization')}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                    <Network size={14} className="text-indigo-400" />
                    {unitLoading ? 'Loading...' : (unit?.name || 'Unknown Unit')}
                  </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white uppercase leading-none">
                 Operator Dashboard
                </h1>
                <p className="text-slate-400 text-xs mt-2 max-w-lg leading-relaxed font-semibold">
                  Sugar production analytics log summaries, aggregate metric calculators, and digital ledger records.
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => navigate(PAGES.DATA_ENTRY)}
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-650/30 uppercase tracking-wider active:scale-[0.98]"
                >
                  <Plus size={14} />
                  New entry
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                <TrendingUp size={16} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cane Crushed YTD</span>
              <span className="text-xl font-black text-slate-950 block">
                {logsLoading ? '—' : totalCane.toLocaleString()} <span className="text-xs text-slate-500 font-bold uppercase">Qtls</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-2 inline-flex items-center gap-0.5 select-none">
                ● Active Season
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                <CalendarDays size={16} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Sugar Bagged YTD</span>
              <span className="text-xl font-black text-indigo-650 block">
                {logsLoading ? '—' : totalSugar.toLocaleString()} <span className="text-xs text-slate-500 font-bold uppercase">Qtls</span>
              </span>
              <span className="text-[10px] text-indigo-600 font-bold mt-2 inline-flex items-center gap-0.5 select-none">
                ● Calculated Output
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-slate-300 group-hover:text-emerald-500 transition-colors">
                <Activity size={16} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Avg Juice Purity</span>
              <span className="text-xl font-black text-emerald-650 block">
                {logsLoading ? '—' : avgPurity}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-2 inline-flex items-center gap-0.5 select-none">
                ● High Quality
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-500 transition-colors">
                <CalendarDays size={16} />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Archive Entries</span>
              <span className="text-xl font-black text-slate-850 block">
                {logsLoading ? '—' : logs.length} <span className="text-xs text-slate-500 font-bold uppercase">Logs</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-2 inline-flex items-center gap-0.5 select-none">
                ● Total Saved Records
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
              <div className="border-b border-slate-150 px-5 py-4 flex items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-slate-650" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Recent Factory Entries</h3>
                </div>
                <button
                  onClick={() => refetch()}
                  className="text-slate-400 hover:text-slate-600 hover:rotate-18 transition-all"
                  title="Refresh logs ledger"
                >
                  <RefreshCw size={13} />
                </button>
              </div>

              {logsLoading ? (
                <div className="p-8 text-center flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin" />
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Syncing ledger records...</span>
                </div>
              ) : isError ? (
                <div className="p-8 text-center text-xs text-red-600 font-bold uppercase">
                  Failed to sync records from active laboratory database.
                </div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-550 font-bold uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => navigate(PAGES.DATA_ENTRY)}>
                  No logs recorded yet. Click to begin a new entry!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-150 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-5 py-3">Log Date</th>
                        <th className="px-5 py-3">Cane Crushed</th>
                        <th className="px-5 py-3">Sugar Output</th>
                        <th className="px-5 py-3">Purity</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logs.slice(0, 4).map((log: DailyLogResponse) => {
                        const metrics = typeof log.metrics === 'string' ? JSON.parse(log.metrics) : log.metrics;
                        const brix = parseFloat(metrics?.primaryJuiceBrix) || 0;
                        const pol = parseFloat(metrics?.primaryJuicePol) || 0;
                        const purity = brix > 0 ? ((pol / brix) * 100).toFixed(2) : '—';
                        
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-5 py-3.5 font-bold text-slate-800">
                              {formatDate(log.logDate)}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-slate-650">
                              {Number(metrics?.caneCrushed || 0).toLocaleString()} Qtls
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-indigo-650">
                              {Number(metrics?.totalSugarBagged || 0).toLocaleString()} Qtls
                            </td>
                            <td className="px-5 py-3.5 font-bold text-emerald-650">
                              {purity}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Link
                                to={getPagePath.analysisReport(log.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-750 text-[10px] font-extrabold rounded-lg transition-all uppercase tracking-wide cursor-pointer"
                              >
                                View Details
                                <ArrowRight size={11} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="border-t border-slate-150 px-5 py-3 bg-slate-50/50 flex justify-end">
                <Link 
                  to={PAGES.LOGS_LIST} 
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest inline-flex items-center gap-1"
                >
                  Full Archive <ArrowRight size={11} />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="border-b border-slate-150 px-5 py-4 select-none">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">System Information</h3>
              </div>
              
              <div className="p-5 flex flex-col gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">System Diagnostics</span>
                  
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-slate-650">System Status</span>
                    <span className="font-bold text-emerald-600 uppercase">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
