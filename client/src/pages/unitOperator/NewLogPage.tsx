import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analysisSchema, type AnalysisSchema } from '../../types/analysisSchema';
import { analysisConfig, getAllSectionIds } from '../../config/analysisConfig';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { FormSidebar } from '../../components/analysis/FormSidebar';
import { FormSection } from '../../components/analysis/FormSection';
import { useUpsertUnitLogMutation, useLockUnitLogMutation, useFetchUnitLogsQuery, useSaveAndGenerateReportMutation } from '../../store/api/apiSlice';
import { useDailyLogCalculations, CALCULATIONS_CONFIG } from '../../hooks/useDailyLogCalculations';
import { useModal } from '../../hooks/useModal';

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
  const [lockUnitLog, { isLoading: isLocking }] = useLockUnitLogMutation();
  const [saveReport] = useSaveAndGenerateReportMutation();
  const { showModal, ModalComponent } = useModal();
  const initialValues = getInitialValues();
  
  const { data: logs = [] } = useFetchUnitLogsQuery(user?.unitId as string, {
    skip: !user?.unitId,
  });

  const selectedDate = methods.watch('todayDate') as string;

  const { isSequentialBlocked, blockingDate, selectedLogStatus, selectedLogId } = useMemo(() => {
    let blocked = false;
    let blockingD = undefined;
    let status = 'NEW';
    let sLogId = undefined;

    if (Array.isArray(logs) && selectedDate) {
      const sortedLogs = [...logs].sort((a, b) => {
        const d1 = new Date(b.createdAt || (b as any).date || (b as any).logDate).getTime();
        const d2 = new Date(a.createdAt || (a as any).date || (a as any).logDate).getTime();
        return d1 - d2;
      });
      
      for (const log of sortedLogs) {
        const logDateVal = log.createdAt || (log as any).date || (log as any).logDate;
        if (!logDateVal) continue;
        const logDateStr = new Date(logDateVal).toISOString().split('T')[0];
        
        if (logDateStr === selectedDate) {
          status = log.status;
          sLogId = log.id;
        }

        if (logDateStr < selectedDate && log.status === 'UNLOCKED') {
          blocked = true;
          blockingD = logDateStr;
        }
      }
    }
    return { isSequentialBlocked: blocked, blockingDate: blockingD, selectedLogStatus: status, selectedLogId: sLogId };
  }, [logs, selectedDate]);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (Array.isArray(logs)) {
      const log = logs.find(l => {
        const logDateVal = l.createdAt || (l as any).date || (l as any).logDate;
        if (!logDateVal) return false;
        return new Date(logDateVal).toISOString().split('T')[0] === selectedDate;
      });
      if (log) {
        const parsedMetrics = typeof log.payload === 'string' ? JSON.parse(log.payload) : log.payload;
        methods.reset({ ...initialValues, ...parsedMetrics, todayDate: selectedDate });
      } else {
        methods.reset({ ...initialValues, todayDate: selectedDate });
      }
    }
  }, [logs, selectedDate, methods]);

  const sectionIds = getAllSectionIds(analysisConfig);
  const defaultSection = sectionIds[0] ?? '';
  const { activeSection: expanded, scrollTo: handleScrollTo } = useScrollSpy(
    sectionIds,
    defaultSection
  );


  const handleUploadData = async () => {
    if (selectedLogStatus === 'LOCKED' || isSequentialBlocked) return;
    const data = methods.getValues();
    const { todayDate, ...rest } = data;
    const payload = {
      createdAt: todayDate as string ?? new Date().toISOString().slice(0, 10),
      payload: rest as Record<string, unknown>,
    };

    try {
      await upsertUnitLog({ unitId: user?.unitId, data: payload }).unwrap();
    } catch (err: any) {
      await showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to save Data' });
    }
  };

  const handleLockData = async () => {
    if (selectedLogStatus === 'LOCKED' || isSequentialBlocked) return;
    
    const confirmLock = await showModal({
      type: 'confirm',
      title: 'Lock Data',
      message: 'Are you sure you want to lock this daily log?\\nOnce locked, you will not be able to edit this data anymore.',
      confirmText: 'Lock Log'
    });
    
    if (!confirmLock) return;

    await handleUploadData();
    if (selectedLogId) {
      try {
        await lockUnitLog(selectedLogId).unwrap();
        await showModal({ type: 'alert', title: 'Success', message: 'Data locked successfully.' });
      } catch (err: any) {
        await showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to lock data' });
      }
    } else {
      await showModal({ type: 'alert', title: 'Notice', message: 'Please save the draft first before locking the data.' });
    }
  };

  const onSubmit = async (data: AnalysisSchema) => {
    const { todayDate, ...rest } = data;
    const payload = {
      createdAt: todayDate as string ?? new Date().toISOString().slice(0, 10),
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

  const handleResetData = () => {
    if (Array.isArray(logs)) {
      const log = logs.find(l => {
        const logDateVal = l.createdAt || (l as any).date || (l as any).logDate;
        if (!logDateVal) return false;
        return new Date(logDateVal).toISOString().split('T')[0] === selectedDate;
      });
      if (log) {
        const parsedMetrics = typeof log.payload === 'string' ? JSON.parse(log.payload) : log.payload;
        methods.reset({ ...initialValues, ...parsedMetrics, todayDate: selectedDate });
      }
    }
  };

  const handleCopyLastLocked = () => {
    if (!Array.isArray(logs)) return;
    
    // Find the most recent locked log BEFORE the selectedDate
    const sortedLogs = [...logs].sort((a, b) => {
      const d1 = new Date(b.createdAt || (b as any).date || (b as any).logDate).getTime();
      const d2 = new Date(a.createdAt || (a as any).date || (a as any).logDate).getTime();
      return d1 - d2;
    });
    const lastLockedLog = sortedLogs.find(
      (log) => {
        const logDateVal = log.createdAt || (log as any).date || (log as any).logDate;
        if (!logDateVal) return false;
        return new Date(logDateVal).toISOString().split('T')[0] < selectedDate && log.status === 'LOCKED';
      }
    );

    if (lastLockedLog) {
      const parsedMetrics = typeof lastLockedLog.payload === 'string' 
        ? JSON.parse(lastLockedLog.payload) 
        : lastLockedLog.payload;
        
      const currentValues = methods.getValues();
      const calculatedFields = CALCULATIONS_CONFIG.map(c => c.targetField);

      // Filter out auto-calculated fields from the copied data
      const filteredMetrics = { ...parsedMetrics };
      calculatedFields.forEach((field) => {
        delete filteredMetrics[field];
      });

      // Merge avoiding overwrite of todayDate
      methods.reset({
        ...currentValues,
        ...filteredMetrics,
        todayDate: selectedDate,
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
            onLockData={handleLockData}
            onResetData={handleResetData}
            isSubmitting={isGenerating || isUpserting || isLocking}
            hasUnsavedChanges={methods.formState.isDirty}
            hasUploadedData={!!selectedLogId}
            isLocked={selectedLogStatus === 'LOCKED'}
            isSequentialBlocked={isSequentialBlocked}
            blockingDate={blockingDate}
          />

          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 relative scroll-smooth flex flex-col items-center">
            
            {!isSequentialBlocked && selectedLogStatus !== 'LOCKED' && (
              <div className="max-w-5xl w-full flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleCopyLastLocked}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all shadow-sm active:scale-[0.98] uppercase tracking-wider"
                >
                  Copy Yesterday's Data
                </button>
              </div>
            )}

            <fieldset 
              disabled={selectedLogStatus === 'LOCKED' || isSequentialBlocked} 
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
