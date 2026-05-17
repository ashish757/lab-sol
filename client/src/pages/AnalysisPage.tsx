import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { analysisSchema, type AnalysisSchema } from '../types/analysisSchema';
import { analysisConfig } from '../features/analysis/analysisConfig';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { FormSidebar } from '../features/analysis/FormSidebar';
import { FormSection } from '../features/analysis/FormSection';
import { useFormPersist } from '../hooks/useFormPersist';
import { PAGES } from '../config/routesConfig';

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
  const navigate = useNavigate();
  const methods = useForm<AnalysisSchema>({
    resolver: zodResolver(analysisSchema),
    mode: 'onBlur',
    defaultValues: getInitialValues(),
  });

  const { saveDraft, clearStorage } = useFormPersist(methods, { key: 'analysis-form' });

  const sectionIds = analysisConfig.map((group) => group.groupId);
  const { activeSection: expanded, scrollTo: handleScrollTo } = useScrollSpy(
    sectionIds,
    analysisConfig[0].groupId
  );

  const handleReset = () => {
    methods.reset(getInitialValues());
    clearStorage();
  };

  const onSubmit = (data: AnalysisSchema) => {
    const { todayDate, ...rest } = data;
    const payload = {
      logDate: todayDate ?? new Date().toISOString().slice(0, 10),
      metrics: rest as Record<string, unknown>,
    };
    
    clearStorage();
    
    navigate(PAGES.NEW_ANALYSIS, { state: { payload } });
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
            onSaveDraft={saveDraft}
            isSubmitting={false}
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
