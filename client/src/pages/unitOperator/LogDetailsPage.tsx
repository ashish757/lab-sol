import { useParams, Link } from 'react-router-dom';
import { useGetDailyLogByIdQuery, useGenerateCalculatedReportMutation } from '../../store/api/apiSlice';
import { useModal } from '../../hooks/useModal';
import { useState } from 'react';
import { ArrowLeft, FileDown, Calendar, Hash, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { getPagePath } from '../../config/routesConfig';
import { useForm, FormProvider } from 'react-hook-form';
import { FormSidebar } from '../../components/analysis/FormSidebar';
import { FormSection } from '../../components/analysis/FormSection';
import { analysisConfig, getAllSectionIds } from '../../config/analysisConfig';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useEffect } from 'react';

export const LogDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: log, isLoading, error } = useGetDailyLogByIdQuery(id as string, {
    skip: !id,
  });

  const [generateReport] = useGenerateCalculatedReportMutation();
  const { showModal, ModalComponent } = useModal();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!log) return;
    
    const logDate = log.createdAt ? new Date(log.createdAt).toISOString().split('T')[0] : '';

    try {
      setIsGenerating(true);
      const { fileBlob } = await generateReport(id as string).unwrap();
      
      const url = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Calculated_Report_${logDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate report", err);
      await showModal({ type: 'alert', title: 'Error', message: "Failed to generate report" });
    } finally {
      setIsGenerating(false);
    }
  };

  const methods = useForm({
    mode: 'onBlur',
    disabled: true
  });

  useEffect(() => {
    if (log?.payload) {
      methods.reset(log.payload);
    }
  }, [log, methods]);

  const sectionIds = getAllSectionIds(analysisConfig);
  const defaultSection = sectionIds[0] ?? '';
  const { activeSection, scrollTo: scrollToSection } = useScrollSpy(
    sectionIds,
    defaultSection
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 shadow-md"></div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Log Not Found</h2>
        <p className="text-slate-600">The requested log could not be loaded.</p>
        <Link to={getPagePath.logsList()} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Back to Logs
        </Link>
      </div>
    );
  }

  const logDate = log.createdAt ? new Date(log.createdAt).toISOString().split('T')[0] : '';
  const isLocked = log.status === 'LOCKED';

  return (
    <div className="flex-1 flex overflow-hidden flex-col bg-slate-50">
      {/* Uploaded Data Interface */}
      <FormProvider {...methods}>
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50">
          <FormSidebar 
            config={analysisConfig} 
            activeSection={activeSection} 
            onScrollTo={scrollToSection} 
            isLocked={true}
            hideLockDataButton={true}
          />
          <div id="scroll-container" className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 relative scroll-smooth flex flex-col items-center">
            
            <div className="max-w-5xl w-full mb-8">
              {/* Navigation & Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-2">
                  <Link to={getPagePath.logsList()} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Logs
                  </Link>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Log Details</h1>
                </div>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </button>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Log ID</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 break-all" title={log.id}>{log.id}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Log Date</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{logDate}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isLocked ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {isLocked ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                    <p className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold mt-1 ${isLocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {log.status}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day Type</p>
                    <p className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold mt-1 ${log.dayType === 'SHUTDOWN' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'}`}>
                      {log.dayType}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <fieldset disabled className="max-w-5xl w-full pb-12 border-none p-0 m-0 disabled:opacity-80">
              {analysisConfig.map(group => (
                <FormSection key={group.groupId} group={group} />
              ))}
            </fieldset>
            
            <div className="mt-4 mb-12 text-center w-full">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">End of Log Data</p>
            </div>
          </div>
        </div>
      </FormProvider>
      <ModalComponent />
    </div>
  );
};
