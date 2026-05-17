import { useMemo } from 'react';
import { useGetLogs } from '../hooks/useDailyLogs';
import type { DailyLogResponse } from '../api/dailyLogs';
import { FileText, AlertCircle, RefreshCw, Layers } from 'lucide-react';

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
  const base = 'inline-flex items-center px-2 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wider border shadow-sm';
  const variants: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-emerald-500/5',
    DRAFT: 'bg-amber-50 text-amber-900 border-amber-300 shadow-amber-500/5',
    PENDING: 'bg-slate-50 text-slate-800 border-slate-300 shadow-slate-500/5',
  };
  const cls = variants[status?.toUpperCase()] ?? variants.PENDING;
  return <span className={`${base} ${cls}`}>{status ?? 'Unknown'}</span>;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-200">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export const LogsPage = () => {
  const { data: logs, isLoading, isError, refetch, isFetching } = useGetLogs();

  const metricsSummary = useMemo(() => {
    if (!logs || logs.length === 0) {
      return { count: 0, totalCane: 0, totalSugar: 0, latest: '—' };
    }
    let totalCane = 0;
    let totalSugar = 0;
    logs.forEach(log => {
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

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-200 bg-white shrink-0 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-indigo-600" />
            <h1 className="text-sm font-black text-slate-900 tracking-wider uppercase">
              Production Logs
            </h1>
          </div>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wide">Historical daily log entries & archives</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-350 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wide cursor-pointer"
        >
          <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      <main className="flex-1 px-8 py-8 max-w-6xl w-full mx-auto">
        {isError && (
          <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-6 shadow-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold uppercase tracking-wider text-xs">Failed to load logs</p>
              <p className="text-xs text-red-500 mt-1">
                Could not connect to the server.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Analytics Summary Cards */}
        {!isLoading && !isError && logs && logs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Total Logs Saved</span>
              <span className="text-xl font-extrabold text-slate-950">{metricsSummary.count} Entries</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Cane Crushed YTD</span>
              <span className="text-xl font-extrabold text-indigo-600">{metricsSummary.totalCane.toLocaleString()} Qtls</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Sugar Bagged YTD</span>
              <span className="text-xl font-extrabold text-emerald-600">{metricsSummary.totalSugar.toLocaleString()} Qtls</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Latest Log Entry</span>
              <span className="text-xl font-extrabold text-slate-800">{metricsSummary.latest}</span>
            </div>
          </div>
        )}

        {!isLoading && !isError && logs?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <FileText size={44} strokeWidth={1.5} className="mb-4 text-slate-300" />
            <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">No logs yet</p>
            <p className="text-xs mt-1 text-slate-500">Submit a daily production form to see metrics entries here.</p>
          </div>
        )}

        {(isLoading || (logs && logs.length > 0)) && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900">
                <thead className="bg-slate-700">
                  <tr>
                    {['Date', 'Status', 'Cane Crushed (Qtls)', 'Total Sugar Bagged (Qtls)', 'Created'].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-5 py-4 font-bold text-slate-200 uppercase tracking-widest whitespace-nowrap select-none"
                        >
                          {col}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {isLoading
                    ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                    : logs?.map((log: DailyLogResponse) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-4 font-medium text-slate-800 whitespace-nowrap">
                            {formatDate(log.logDate)}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="px-4 py-4 tabular-nums text-slate-800 font-bold">
                            {getMetric(log.metrics, 'caneCrushed')}
                          </td>
                          <td className="px-4 py-4 tabular-nums text-slate-800 font-bold">
                            {getMetric(log.metrics, 'totalSugarBagged')}
                          </td>
                          <td className="px-4 py-4 text-slate-600 font-semibold whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="px-8 py-5 border-t border-slate-200 text-xs text-slate-500 font-semibold text-center shrink-0 bg-white mt-auto">
        Enterprise Analytics System v1.0
      </footer>
    </div>
  );
};
