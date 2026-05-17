import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, Calendar, ArrowLeft, 
  Plus, ShieldAlert, Database, Download
} from 'lucide-react';
import { useUpsertLog, useGetLogById } from '../hooks/useDailyLogs';
import { PAGES, getPagePath } from '../config/routesConfig';
import { getDownloadDailyReportUrl } from '../api/dailyLogs';

export const AnalysisReportPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isNew = !id || id === 'new';
  const mutation = useUpsertLog();
  const query = useGetLogById(id);

  const handleDownloadExcel = () => {
    const url = getDownloadDailyReportUrl();
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Daily_Report.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [createdLogId, setCreatedLogId] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState('Initializing payload...');

  // 1. Trigger log generation on mount if this is /analysis/new
  useEffect(() => {
    if (isNew) {
      const payload = location.state?.payload;
      if (!payload) {
        navigate(PAGES.NEW_LOG, { replace: true });
        return;
      }

      // Phase transitions for beautiful enterprise simulation
      const timer1 = setTimeout(() => setLoadingPhase('Calculating sugar recovery & ratios...'), 800);
      const timer2 = setTimeout(() => setLoadingPhase('Securing transaction to PostgreSQL database...'), 1600);

      mutation.mutate(payload, {
        onSuccess: (data) => {
          setCreatedLogId(data.id);
          // Replace URL with the actual report ID, so refreshing works
          setTimeout(() => {
            navigate(getPagePath.analysisReport(data.id), { replace: true });
          }, 2400);
        },
        onError: (err) => {
          console.error(err);
        }
      });

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isNew, location.state]);

  // Determine active log data
  const logData = isNew ? mutation.data : query.data;
  const isLoading = isNew ? (!createdLogId || mutation.isPending) : query.isLoading;
  const isError = isNew ? mutation.isError : query.isError;

  // Format Helper
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Helper to extract nested metrics
  const getMetric = (metrics: any, key: string, fallback: string = '—') => {
    if (!metrics) return fallback;
    const parsedMetrics = typeof metrics === 'string' ? JSON.parse(metrics) : metrics;
    return parsedMetrics[key] !== undefined && parsedMetrics[key] !== null
      ? parsedMetrics[key]
      : fallback;
  };

  // 2. Loading State (Premium corporate loader)
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-screen p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            <Database className="w-6 h-6 text-indigo-600 absolute animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
              {isNew ? 'Generating Report' : 'Retrieving Record'}
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Daily Production Ledger
            </p>
          </div>
          
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-2/3 rounded-full animate-infinite-scroll" />
          </div>

          <p className="text-xs font-semibold text-slate-650 animate-pulse bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 w-full">
            {isNew ? loadingPhase : 'Querying secure cluster...'}
          </p>
        </div>
      </div>
    );
  }

  // 3. Error State
  if (isError || !logData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-screen p-8">
        <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-8 max-w-md w-full text-center flex flex-col items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-650">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
              Ledger Query Failed
            </h2>
            <p className="text-xs text-red-650 mt-1 font-semibold">
              {isNew ? 'Failed to archive log entry.' : 'The requested report UUID could not be resolved.'}
            </p>
          </div>
          <Link
            to={PAGES.NEW_LOG}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg border border-slate-950 transition-colors uppercase tracking-wider"
          >
            Create New Log
          </Link>
        </div>
      </div>
    );
  }

  // Calculate high-contrast Purity ratios for metrics display
  const primaryBrix = parseFloat(getMetric(logData.metrics, 'primaryJuiceBrix', '0'));
  const primaryPol = parseFloat(getMetric(logData.metrics, 'primaryJuicePol', '0'));
  const purity = primaryBrix > 0 ? ((primaryPol / primaryBrix) * 100).toFixed(2) + '%' : '—';

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      
      {/* Action Sub-Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to={PAGES.LOGS_LIST}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-slate-650"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">REPORT ARCHIVE</span>
            <h1 className="text-sm font-extrabold text-slate-900">Analysis Summary</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={PAGES.NEW_LOG}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer uppercase tracking-wider shadow-md shadow-indigo-600/10"
          >
            <Plus size={14} />
            New Entry
          </Link>
        </div>
      </div>

      {/* Main Print Container */}
      <main className="max-w-4xl mx-auto px-6 py-8 w-full flex-1 flex flex-col gap-6 print:p-0 print:my-0">
        
        {/* Banner Success Card */}
        <div className="bg-slate-950 text-white border border-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-xl print:border-black print:text-black print:bg-white print:p-0 print:shadow-none">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none print:hidden" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 print:text-black">
              <CheckCircle2 size={22} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider select-none print:text-black">
                  ● REPORT SECURELY LEDGERED
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400 uppercase tracking-wider print:border-black print:text-black">
                  {logData.status || 'COMPLETED'}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1 print:text-black">
                Daily Production Log Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-900 text-xs text-slate-450 print:border-slate-300 print:text-black">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-500 print:text-black" />
                  <span className="font-semibold text-slate-300 print:text-black">Log Date:</span>
                  <span className="font-bold text-white print:text-black">{formatDate(logData.logDate)}</span>
                </div>
              </div>

              <div className="flex justify-end mt-5 pt-4 border-t border-slate-900 print:hidden">
                <button
                  onClick={handleDownloadExcel}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-extrabold rounded-lg border border-indigo-700 hover:border-indigo-600 transition-all shadow-lg shadow-indigo-650/45 cursor-pointer uppercase tracking-widest"
                >
                  <Download size={14} />
                  Download Excel Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cane Crushed</span>
            <span className="text-lg font-extrabold text-slate-950">
              {Number(getMetric(logData.metrics, 'caneCrushed', '0')).toLocaleString()} Qtls
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Sugar Bagged</span>
            <span className="text-lg font-extrabold text-indigo-650">
              {Number(getMetric(logData.metrics, 'totalSugarBagged', '0')).toLocaleString()} Qtls
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Primary Purity</span>
            <span className="text-lg font-extrabold text-emerald-650">
              {purity}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Crop Day</span>
            <span className="text-lg font-extrabold text-slate-800">
              Day {getMetric(logData.metrics, 'cropDay', '0')}
            </span>
          </div>
        </div>

      </main>
    </div>
  );
};
