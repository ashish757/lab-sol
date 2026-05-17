import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analysisSchema, type AnalysisSchema } from '../types/analysisSchema';
import { analysisConfig } from '../features/analysis/analysisConfig';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { FormSidebar } from '../features/analysis/FormSidebar';
import { FormSection } from '../features/analysis/FormSection';
import { useFormPersist } from '../hooks/useFormPersist';

export const AnalysisPage = () => {
  const methods = useForm<AnalysisSchema>({
    resolver: zodResolver(analysisSchema),
    mode: 'onBlur',
    defaultValues: {},
  });

  const { saveDraft, clearStorage } = useFormPersist(methods, { key: 'analysis-form' });

  const sectionIds = analysisConfig.map((group) => group.groupId);
  const { activeSection: expanded, scrollTo: handleScrollTo } = useScrollSpy(
    sectionIds,
    analysisConfig[0].groupId
  );

  const handleReset = () => {
    methods.reset({});
    clearStorage();
  };

  const onSubmit = async (data: AnalysisSchema) => {
    try {
      const response = await fetch('http://localhost:3000/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        clearStorage();
        console.log("Report generated and persistence cleared.");
      } else {
        console.error("Backend error status:", response.status);
      }
    } catch (error) {
      console.error("Failed to connect to backend:", error);
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
            onSaveDraft={saveDraft}
          />

          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-white relative scroll-smooth">
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
