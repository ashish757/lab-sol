import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useGetDailyLogsQuery, useGetOrganizationByIdQuery } from '../../store/api/apiSlice';
import type { DailyLogResponse } from '../../types/dailyLogs';
import { FileText, AlertCircle, RefreshCw, Layers, Filter, Activity, TrendingUp, Clock } from 'lucide-react';
import { getPagePath } from '../../config/routesConfig';

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function getMetric(
  metrics: Record<string, unknown>,
  key: string,
): string {
  const val = metrics?.[key];
  if (val === undefined || val === null) return '—';
  return Number(val).toLocaleString('en-IN');
}

function StatusBadge({ status }: { status: string }) {
  const base = 'inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shadow-sm';
  const variants: Record<string, string> = {
    LOCKED: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-500/10',
    UNLOCKED: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-500/10',
  };
  const cls = variants[status?.toUpperCase()];
  return <span className={`${base} ${cls}`}>{status  == "UNLOCKED" ? 'DRAFT' : status}</span>;
}

function SkeletonRow({ isAdminOrStaff }: { isAdminOrStaff: boolean }) {
  const cols = isAdminOrStaff ? 7 : 6;
  return (
    <tr className="border-b border-slate-100">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-5 py-5">
          <div className="h-4 bg-slate-100/80 rounded animate-pulse w-2/3" />
        </td>
      ))}
    </tr>
  );
}

export const LogsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdminOrStaff = user?.role === 'ORG_ADMIN' || user?.role === 'ORG_STAFF';

  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');

  const { data: org } = useGetOrganizationByIdQuery(user?.orgId as string, {
    skip: !user?.orgId || !isAdminOrStaff,
  });

  const { data: rawLogs, isLoading, isError, refetch, isFetching } = useGetDailyLogsQuery({});

  const logs = useMemo(() => {
    if (!rawLogs) return [];
    if (selectedUnit === 'ALL') return rawLogs;
    return rawLogs.filter((log: any) => log.unitId === selectedUnit);
  }, [rawLogs, selectedUnit]);

  const metricsSummary = useMemo(() => {
    if (!logs || logs.length === 0) {
      return { count: 0, totalCane: 0, totalSugar: 0, latest: '—' };
    }
    let totalCane = 0;
    let totalSugar = 0;
    logs.forEach((log: DailyLogResponse) => {
      const cane = parseFloat(log.metrics?.caneCrushed as string);
      const sugar = parseFloat(log.metrics?.totalSugarBagged as string);
      if (!isNaN(cane)) totalCane += cane;
      if (!isNaN(sugar)) totalSugar += sugar;
    });
    return {
      count: logs.length,
      totalCane: Math.round(totalCane),
      totalSugar: Math.round(totalSugar),
      latest: formatDate(logs[0].logDate)
    };
  }, [logs]);

  const columns = isAdminOrStaff
    ? ['Date', 'Unit', 'Status', 'Cane Crushed (Qtls)', 'Sugar Bagged (Qtls)', 'Locked', 'Action']
    : ['Date', 'Status', 'Cane Crushed (Qtls)', 'Sugar Bagged (Qtls)', 'Locked', 'Action'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] flex flex-col">
      <main className="flex-1 px-8 py-10 max-w-7xl w-full mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                <Layers className="text-white" size={24} />
              </div>
              Production Logs
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-1">
              Historical daily log entries and analytics
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdminOrStaff && org && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Filter size={16} className="text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer min-w-[180px]"
                >
                  <option value="ALL">All Units</option>
                  {org.units?.map((unit: any) => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <RefreshCw size={16} className={`${isFetching ? 'animate-spin text-indigo-600' : 'text-slate-400'}`} />
              Refresh
            </button>
          </div>
        </div>

        {isError && (
          <div className="flex items-start gap-3 px-6 py-5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 mb-8 shadow-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold uppercase tracking-wider text-xs">Failed to load logs</p>
              <p className="text-sm font-medium text-red-600 mt-1">
                Could not connect to the server. Please check your connection and try again.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Analytics Summary Cards */}
        {!isLoading && !isError && rawLogs && rawLogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <FileText size={100} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Logs Shown</span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">{metricsSummary.count}</span>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-indigo-600">
                <Activity size={100} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Cane Crushed (Filtered)</span>
              <span className="text-3xl font-black text-indigo-600 tracking-tight">{metricsSummary.totalCane.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-400 ml-1">Qtls</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-emerald-600">
                <TrendingUp size={100} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Sugar Bagged (Filtered)</span>
              <span className="text-3xl font-black text-emerald-600 tracking-tight">{metricsSummary.totalSugar.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-400 ml-1">Qtls</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-purple-600">
                <Clock size={100} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Latest Log Entry</span>
              <span className="text-2xl font-black text-slate-800 tracking-tight leading-none mt-1 block">{metricsSummary.latest}</span>
            </div>
          </div>
        )}

        {!isLoading && !isError && logs?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="p-5 bg-slate-50 rounded-full mb-5 border border-slate-100">
              <FileText size={48} strokeWidth={1.5} className="text-slate-300" />
            </div>
            <p className="text-base font-bold text-slate-700 tracking-tight">No logs found</p>
            <p className="text-sm mt-2 text-slate-500 font-medium">There are no daily logs matching this filter criteria.</p>
          </div>
        )}

        {(isLoading || (logs && logs.length > 0)) && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-900">
                <thead className="bg-slate-200 border-b border-slate-200">
                  <tr>
                    {columns.map(
                      (col) => (
                        <th
                          key={col}
                          className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap select-none"
                        >
                          {col}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {isLoading
                    ? [...Array(5)].map((_, i) => <SkeletonRow key={i} isAdminOrStaff={isAdminOrStaff} />)
                    : logs?.map((log: any) => (
                        <tr
                          key={log.id}
                          className="hover:bg-indigo-50/30 transition-colors group"
                        >
                          <td className="px-6 py-5 font-bold text-slate-900 whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                          {isAdminOrStaff && (
                            <td className="px-6 py-5 font-bold text-indigo-700 whitespace-nowrap">
                              {log.unit?.name || '—'}
                            </td>
                          )}
                          <td className="px-6 py-5">
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="px-6 py-5 tabular-nums text-slate-700 font-semibold">
                            {getMetric(log.metrics, 'caneCrushed')}
                          </td>
                          <td className="px-6 py-5 tabular-nums text-slate-700 font-semibold">
                            {getMetric(log.metrics, 'totalSugarBagged')}
                          </td>
                          <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap text-xs">
                            {formatDate(log.lockedAt)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <Link
                              to={getPagePath.analysisReport(log.id)}
                              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-slate-200 hover:border-indigo-200 transition-all shadow-sm"
                            >
                              <FileText size={14} className="text-indigo-500" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
