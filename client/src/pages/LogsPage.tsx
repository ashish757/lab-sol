import { useGetLogs } from '../hooks/useDailyLogs';
import type { DailyLogResponse } from '../api/dailyLogs';
import { FileText, AlertCircle, RefreshCw } from 'lucide-react';

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
  return String(val);
}

function StatusBadge({ status }: { status: string }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';
  const variants: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    DRAFT: 'bg-amber-50 text-amber-700 border border-amber-200',
    PENDING: 'bg-slate-100 text-slate-600 border border-slate-200',
  };
  const cls = variants[status?.toUpperCase()] ?? variants.PENDING;
  return <span className={`${base} ${cls}`}>{status ?? 'Unknown'}</span>;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 bg-slate-100 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export const LogsPage = () => {
  const { data: logs, isLoading, isError, refetch, isFetching } = useGetLogs();

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col">
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-slate-200 bg-white shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-slate-800 tracking-tight">
            Production Logs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Historical daily log entries</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      <main className="flex-1 px-8 py-6">
        {isError && (
          <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 mb-6">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Failed to load logs</p>
              <p className="text-xs text-red-500 mt-0.5">
                Make sure the backend is running
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && logs?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
            <FileText size={36} strokeWidth={1.25} className="mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No logs yet</p>
            <p className="text-xs mt-1">Submit a production form to see entries here.</p>
          </div>
        )}

        {(isLoading || (logs && logs.length > 0)) && (
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Date', 'Status', 'Cane Crushed (T)', 'Total Sugar Bagged (T)', 'Created'].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading
                  ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                  : logs?.map((log: DailyLogResponse) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">
                          {formatDate(log.logDate)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={log.status} />
                        </td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">
                          {getMetric(log.metrics, 'caneCrushed')}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-slate-600">
                          {getMetric(log.metrics, 'totalSugarBagged')}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="px-8 py-4 border-t border-slate-100 text-xs text-slate-400 text-center shrink-0">
        Internal use only · Enterprise Analytics v1.0
      </footer>
    </div>
  );
};
