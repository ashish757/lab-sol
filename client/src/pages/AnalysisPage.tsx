import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analysisSchema, type AnalysisSchema } from '../types/analysisSchema';
import { analysisConfig, getAllSectionIds } from '../config/analysisConfig';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { FormSidebar } from '../components/analysis/FormSidebar';
import { FormSection } from '../components/analysis/FormSection';
import { useUpsertLog, useGetLogsByDate } from '../hooks/useDailyLogs';
import { saveAndGenerateReport } from '../api/dailyLogs';

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

export const AnalysisPage = () => {
  const methods = useForm<AnalysisSchema>({
    resolver: zodResolver(analysisSchema),
    mode: 'onBlur',
    defaultValues: getInitialValues(),
  });

  const upsertMutation = useUpsertLog();
  const [isGenerating, setIsGenerating] = useState(false);

  const initialValues = getInitialValues();
  const { data: todayLogs } = useGetLogsByDate(initialValues.todayDate);

  useEffect(() => {
    if (todayLogs && todayLogs.length > 0) {
      const log = todayLogs[0];
      const parsedMetrics = typeof log.metrics === 'string' ? JSON.parse(log.metrics) : log.metrics;
      methods.reset({ ...initialValues, ...parsedMetrics, todayDate: log.logDate.split('T')[0] });
    }
  }, [todayLogs, methods]);

  const sectionIds = getAllSectionIds(analysisConfig);
  const defaultSection = sectionIds[0] ?? '';
  const { activeSection: expanded, scrollTo: handleScrollTo } = useScrollSpy(
    sectionIds,
    defaultSection
  );

  const handleReset = () => {
    methods.reset(getInitialValues());
  };

  const handleUploadData = () => {
    const data = methods.getValues();
    const { todayDate, ...rest } = data;
    const payload  = {
      logDate: todayDate as string ?? new Date().toISOString().slice(0, 10),
      metrics: rest as Record<string, unknown>,
    };

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        methods.reset(methods.getValues());
      }
    });
  };

  const onSubmit = async (data: AnalysisSchema) => {
    const { todayDate, ...rest } = data;
    const payload = {
      logDate: todayDate as string ?? new Date().toISOString().slice(0, 10),
      metrics: rest as Record<string, unknown>,
    };

    try {
      setIsGenerating(true);
      const { id, fileBlob } = await saveAndGenerateReport(payload);
      
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
            onReset={handleReset}
            onUploadData={handleUploadData}
            isSubmitting={isGenerating || upsertMutation.isPending}
            hasUnsavedChanges={methods.formState.isDirty}
          />

          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 relative scroll-smooth">
            <div className="max-w-5xl mx-auto pb-24">
              {analysisConfig.map((group) => (
                <FormSection key={group.groupId} group={group} />
              ))}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
