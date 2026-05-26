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
import { useDailyLogCalculations } from '../../hooks/useDailyLogCalculations';

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

    if (Array.isArray(logs)) {
      const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      for (const log of sortedLogs) {
        const logDateStr = new Date(log.date).toISOString().split('T')[0];
        
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
      const log = logs.find(l => new Date(l.date).toISOString().split('T')[0] === selectedDate);
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
      date: todayDate as string ?? new Date().toISOString().slice(0, 10),
      payload: rest as Record<string, unknown>,
    };

    try {
      await upsertUnitLog({ unitId: user?.unitId, data: payload }).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to save Data');
    }
  };

  const handleLockData = async () => {
    if (selectedLogStatus === 'LOCKED' || isSequentialBlocked) return;
    await handleUploadData();
    if (selectedLogId) {
      try {
        await lockUnitLog(selectedLogId).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to lock data');
      }
    } else {
      // It's a new log, it needs to be saved first to get ID. The hook re-fetches logs, so the ID will be available next render.
      // We can show a message to save first.
      alert('Please save the draft first before locking the data.');
    }
  };

  const onSubmit = async (data: AnalysisSchema) => {
    const { todayDate, ...rest } = data;
    const payload = {
      date: todayDate as string ?? new Date().toISOString().slice(0, 10),
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
      alert("Failed to generate report");
    } finally {
      setIsGenerating(false);
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
            isSubmitting={isGenerating || isUpserting || isLocking}
            hasUnsavedChanges={methods.formState.isDirty}
            isLocked={selectedLogStatus === 'LOCKED'}
            isSequentialBlocked={isSequentialBlocked}
            blockingDate={blockingDate}
          />

          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 relative scroll-smooth">
            <fieldset 
              disabled={selectedLogStatus === 'LOCKED' || isSequentialBlocked} 
              className="max-w-5xl mx-auto pb-24 border-none p-0 m-0 disabled:opacity-60"
            >
              {analysisConfig.map((group) => (
                <FormSection key={group.groupId} group={group} />
              ))}
            </fieldset>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
