import { useState, useEffect, useMemo } from 'react';
import { CalendarX, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analysisSchema, type AnalysisSchema } from '../../types/analysisSchema';
import { analysisConfig, getAllSectionIds } from '../../config/analysisConfig';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { FormSidebar } from '../../components/analysis/FormSidebar';
import { FormSection } from '../../components/analysis/FormSection';
import { useUpsertUnitLogMutation, useFetchUnitLogsQuery, useSaveAndGenerateReportMutation, useGetActiveSessionQuery } from '../../store/api/apiSlice';
import { useDailyLogCalculations, CALCULATIONS_CONFIG } from '../../hooks/useDailyLogCalculations';
import { useModal } from '../../hooks/useModal';
import { PowerOff } from 'lucide-react';

const getInitialValues = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');

  const currentDate = `${year}-${month}-${day}`;
  const currentTime = `${hours}:${minutes}`;

  return {
    plantStartDate: currentDate,
    plantStartTime: currentTime,
    plantShutdownDate: currentDate,
    plantShutdownTime: currentTime,
    todayDate: currentDate,
  };
};

export const NewLogPage = () => {
  const methods = useForm<AnalysisSchema>({
    resolver: zodResolver(analysisSchema),
    mode: 'onBlur',
    defaultValues: getInitialValues(),
  });

  useDailyLogCalculations(methods.control, methods.setValue);

  const { user } = useSelector((state: RootState) => state.auth);
  const [upsertUnitLog, { isLoading: isUpserting }] = useUpsertUnitLogMutation();
  const [saveReport] = useSaveAndGenerateReportMutation();
  const { showModal, ModalComponent } = useModal();
  const initialValues = useMemo(() => getInitialValues(), []);
  
  const { data: session, isLoading: isSessionLoading } = useGetActiveSessionQuery(user?.unitId as string, {
    skip: !user?.unitId,
  });
  
  const { data: logs = [], isLoading: isLogsLoading } = useFetchUnitLogsQuery(user?.unitId as string, {
    skip: !user?.unitId,
  });

  const { activeDate, selectedLogStatus, selectedLogId, isFillingPastData, currentDayType, hasDayEnded, missedDates } = useMemo(() => {
    let status = 'NEW';
    let sLogId = undefined;
    let nextExpectedDate: string | null = null;
    let missingOrUnlocked = false;
    let dayType = 'NORMAL';

    if (session?.sessionStartDate && session?.isLocked) {
      nextExpectedDate = session.sessionStartDate;

      if (Array.isArray(logs) && logs.length > 0) {
        const sortedLogsAsc = [...logs]
          .filter(log => {
             const logDateVal = log.createdAt || (log as any).date || (log as any).logDate;
             if (!logDateVal) return false;
             return new Date(logDateVal).toISOString().split('T')[0] >= session.sessionStartDate;
          })
          .sort((a, b) => {
            const d1 = new Date(a.createdAt || (a as any).date || (a as any).logDate).getTime();
            const d2 = new Date(b.createdAt || (b as any).date || (b as any).logDate).getTime();
            return d1 - d2;
          });

        const currentDate = new Date(`${session.sessionStartDate}T00:00:00Z`);
        
        for (const log of sortedLogsAsc) {
          const logDateVal = log.createdAt || (log as any).date || (log as any).logDate;
          if (!logDateVal) continue;
          const logDateStr = new Date(logDateVal).toISOString().split('T')[0];
          const currentDateStr = currentDate.toISOString().split('T')[0];
          
          if (logDateStr > currentDateStr) {
            nextExpectedDate = currentDateStr;
            missingOrUnlocked = true;
            break;
          }
          
          if (log.status === 'UNLOCKED') {
            nextExpectedDate = logDateStr;
            missingOrUnlocked = true;
            break;
          }
          
          currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }
        
        if (!missingOrUnlocked) {
          nextExpectedDate = currentDate.toISOString().split('T')[0];
        }
      }
    }

    const calculatedActiveDate = nextExpectedDate || initialValues.todayDate;

    if (Array.isArray(logs)) {
      for (const log of logs) {
        const logDateVal = log.createdAt || (log as any).date || (log as any).logDate;
        if (!logDateVal) continue;
        const logDateStr = new Date(logDateVal).toISOString().split('T')[0];
        
        if (logDateStr === calculatedActiveDate) {
          status = log.status;
          sLogId = log.id;
          dayType = log.dayType || 'NORMAL';
        }
      }
    }

    let hasDayEnded = true;
    if (session?.dayStartTime) {
      const [h, m] = session.dayStartTime.split(':').map(Number);
      const dayEndDate = new Date(`${calculatedActiveDate}T00:00:00Z`);
      dayEndDate.setUTCDate(dayEndDate.getUTCDate() + 1);
      dayEndDate.setUTCHours(h, m, 0, 0);
      const now = new Date();
      if (now < dayEndDate) {
        hasDayEnded = false;
      }
    }

    const isFillingPastData = calculatedActiveDate < initialValues.todayDate;

    const missedDates = Array.isArray(logs) 
      ? logs
          .filter(l => l.dayType === 'MISSED_SHUTDOWN')
          .map(l => {
             const logDateVal = l.createdAt || (l as any).date || (l as any).logDate;
             return logDateVal ? new Date(logDateVal).toISOString().split('T')[0] : '';
          })
          .filter(Boolean)
          .sort()
      : [];

    return { 
      activeDate: calculatedActiveDate, 
      selectedLogStatus: status, 
      selectedLogId: sLogId,
      isFillingPastData,
      currentDayType: dayType,
      hasDayEnded,
      missedDates
    };
  }, [logs, initialValues.todayDate, session]);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    methods.setValue('todayDate', activeDate);

    if (Array.isArray(logs)) {
      const log = logs.find(l => {
        const logDateVal = l.createdAt || (l as any).date || (l as any).logDate;
        if (!logDateVal) return false;
        return new Date(logDateVal).toISOString().split('T')[0] === activeDate;
      });
      if (log) {
        const parsedMetrics = typeof log.payload === 'string' ? JSON.parse(log.payload) : log.payload;
        methods.reset({ 
          ...initialValues, 
          ...parsedMetrics, 
          todayDate: activeDate,
          seasonStartDate: session?.sessionStartDate || '',
          seasonStartTime: session?.sessionStartTime || '',
          seasonOffDate: session?.sessionOffDate || '',
          seasonOffTime: session?.sessionOffTime || '',
          dayStartTime: session?.dayStartTime || '',
        });
      } else {
        methods.reset({ 
          ...initialValues, 
          todayDate: activeDate,
          seasonStartDate: session?.sessionStartDate || '',
          seasonStartTime: session?.sessionStartTime || '',
          seasonOffDate: session?.sessionOffDate || '',
          seasonOffTime: session?.sessionOffTime || '',
          dayStartTime: session?.dayStartTime || '',
        });
      }
    }
  }, [logs, session, activeDate, methods, initialValues]);

  const sectionIds = getAllSectionIds(analysisConfig);
  const defaultSection = sectionIds[0] ?? '';
  const { activeSection: expanded, scrollTo: handleScrollTo } = useScrollSpy(
    sectionIds,
    defaultSection
  );


  const handleUploadData = async () => {
    if (selectedLogStatus === 'LOCKED') return;
    const data = methods.getValues();
    const { todayDate, ...rest } = data;
    const payload = {
      createdAt: activeDate,
      payload: rest as Record<string, unknown>,
    };

    try {
      await upsertUnitLog({ unitId: user?.unitId, data: payload }).unwrap();
    } catch (err: any) {
      await showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to save Data' });
    }
  };

  const handleMarkShutdown = async () => {
    if (selectedLogStatus === 'LOCKED') return;
    const confirmLock = await showModal({
      type: 'confirm',
      title: 'Mark Day as Shutdown',
      message: 'Are you sure you want to mark this day as a shutdown? The log will be marked as empty.',
      confirmText: 'Confirm Shutdown'
    });
    
    if (!confirmLock) return;

    const payload = {
      createdAt: activeDate,
      payload: {},
      dayType: 'SHUTDOWN'
    };

    try {
      await upsertUnitLog({ unitId: user?.unitId, data: payload }).unwrap();
      await showModal({ type: 'alert', title: 'Success', message: 'Day marked as shutdown successfully.' });
    } catch (err: any) {
      await showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to mark shutdown' });
    }
  };

  const onSubmit = async (data: AnalysisSchema) => {
    const { todayDate, ...rest } = data;
    const payload = {
      createdAt: activeDate,
      payload: rest as Record<string, unknown>,
    };

    try {
      setIsGenerating(true);
      const { id, fileBlob } = await saveReport(payload).unwrap();
      
      const url = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Daily_Report_${id || 'new'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      methods.reset(methods.getValues());
    } catch (error) {
      console.error("Failed to generate report", error);
      await showModal({ type: 'alert', title: 'Error', message: "Failed to generate report" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLastLocked = () => {
    if (!Array.isArray(logs)) return;
    
    const sortedLogs = [...logs].sort((a, b) => {
      const d1 = new Date(b.createdAt || (b as any).date || (b as any).logDate).getTime();
      const d2 = new Date(a.createdAt || (a as any).date || (a as any).logDate).getTime();
      return d1 - d2;
    });
    const lastLockedLog = sortedLogs.find(
      (log) => {
        const logDateVal = log.createdAt || (log as any).date || (log as any).logDate;
        if (!logDateVal) return false;
        return new Date(logDateVal).toISOString().split('T')[0] < activeDate && log.status === 'LOCKED';
      }
    );

    if (lastLockedLog) {
      const parsedMetrics = typeof lastLockedLog.payload === 'string' 
        ? JSON.parse(lastLockedLog.payload) 
        : lastLockedLog.payload;
        
      const currentValues = methods.getValues();
      const calculatedFields = CALCULATIONS_CONFIG.map(c => c.targetField);

      const filteredMetrics = { ...parsedMetrics };
      calculatedFields.forEach((field) => {
        delete filteredMetrics[field];
      });

      methods.reset({
        ...currentValues,
        ...filteredMetrics,
        todayDate: activeDate,
      });
    } else {
      showModal({ type: 'alert', title: 'Notice', message: "No previously locked log found to copy from." });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const form = e.currentTarget;
      const inputs = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
          'input:not([type="hidden"]):not([disabled]), select:not([disabled])'
        )
      );

      const index = inputs.indexOf(e.target as any);
      if (index > -1) {
        if (e.shiftKey) {
          if (index > 0) {
            inputs[index - 1].focus();
          }
        } else {
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      }
    }
  };

  if (isSessionLoading || isLogsLoading) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 shadow-md"></div>
      </div>
    );
  }

  if (!session?.isLocked || !session?.sessionStartDate) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle animated background shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-900/5 rounded-3xl p-10 max-w-lg text-center transform transition-all duration-500 hover:scale-[1.02]">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
            <CalendarX size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Season Not Started</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
            Your organization administrator has not set a start date for the current crushing season. 
          </p>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100/50">
            <p className="text-amber-800 text-sm font-bold tracking-wide">
              Please contact your administrator to configure the season settings before uploading data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden flex-col bg-white">

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="flex flex-1 overflow-hidden flex-col lg:flex-row"
        >
          <FormSidebar
            config={analysisConfig}
            activeSection={expanded}
            onScrollTo={handleScrollTo}
            onUploadData={handleUploadData}
            onLockData={() => {}}
            isSubmitting={isGenerating || isUpserting}
            hasUnsavedChanges={methods.formState.isDirty}
            hasUploadedData={!!selectedLogId}
            isLocked={selectedLogStatus === 'LOCKED' || currentDayType === 'SHUTDOWN' || !hasDayEnded}
            isSequentialBlocked={false}
            blockingDate={activeDate}
            isFillingPastData={isFillingPastData}
            hideLockDataButton={true}
          />

          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 relative scroll-smooth flex flex-col items-center">
            
            {missedDates.length > 0 && (
              <div className="max-w-5xl w-full mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center shadow-sm">
                <p className="text-amber-800 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <CalendarX size={18} />
                  You did not log data for {missedDates.length === 1 ? 'yesterday' : 'some days'}!
                </p>
                <p className="text-amber-700 text-xs mt-1 font-semibold">
                  Missed dates: {missedDates.join(', ')}. These days have been marked as missed shutdowns.
                </p>
              </div>
            )}

            {!hasDayEnded && selectedLogStatus !== 'LOCKED' && currentDayType !== 'SHUTDOWN' && (
              <div className="max-w-5xl w-full mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-center shadow-sm">
                <p className="text-indigo-800 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <Clock size={18} />
                  Day has not ended yet
                </p>
                <p className="text-indigo-700 text-xs mt-1 font-semibold">
                  You can only upload data for {activeDate} after {session?.dayStartTime} on the next day.
                </p>
              </div>
            )}

            {hasDayEnded && selectedLogStatus !== 'LOCKED' && currentDayType !== 'SHUTDOWN' && (
              <div className="max-w-5xl w-full flex justify-between mb-4">
                <button
                  type="button"
                  onClick={handleMarkShutdown}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-all shadow-sm active:scale-[0.98] uppercase tracking-wider flex items-center gap-1.5"
                >
                  <PowerOff size={14} />
                  Mark Day as Shutdown
                </button>
                <button
                  type="button"
                  onClick={handleCopyLastLocked}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all shadow-sm active:scale-[0.98] uppercase tracking-wider"
                >
                  Copy Yesterday's Data
                </button>
              </div>
            )}

            {currentDayType === 'SHUTDOWN' && (
              <div className="max-w-5xl w-full mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <p className="text-rose-700 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <PowerOff size={18} />
                  This day is marked as a Shutdown
                </p>
              </div>
            )}

            <fieldset 
              disabled={selectedLogStatus === 'LOCKED' || currentDayType === 'SHUTDOWN' || !hasDayEnded} 
              className="max-w-5xl w-full pb-24 border-none p-0 m-0 disabled:opacity-60"
            >
              {analysisConfig.map((group) => (
                <FormSection key={group.groupId} group={group} />
              ))}
            </fieldset>
          </div>
        </form>
      </FormProvider>
      <ModalComponent />
    </div>
  );
};
