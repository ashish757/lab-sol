import { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analysisSchema, type AnalysisSchema } from '../../types/analysisSchema';
import { analysisConfig } from './analysisConfig';
import { PrimitiveInput } from './PrimitiveInputs';

export const AnalysisForm = () => {
  const methods = useForm<AnalysisSchema>({
    resolver: zodResolver(analysisSchema),
    mode: 'onBlur',
    defaultValues: {},
  });

  const [expanded, setExpanded] = useState<string>(analysisConfig[0].groupId);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isClickScrolling.current) {
            setExpanded(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    analysisConfig.forEach((group) => {
      const el = document.getElementById(group.groupId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (groupId: string) => {
    isClickScrolling.current = true;
    setExpanded(groupId);
    document.getElementById(groupId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const onSubmit = (data: AnalysisSchema) => {
    console.log("Data: ", data);
  };

  return (
    <div className="min-h-screen">
        <div className="bg-white  overflow-hidden flex flex-col h-[calc(100vh-3rem)]">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center z-10 shadow-sm">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Analysis</h1>
            <button
              onClick={methods.handleSubmit(onSubmit)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            >
              Generate Report
            </button>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-1 overflow-hidden flex-col lg:flex-row">
              
              <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto z-0">
                <nav className="flex flex-col py-4">
                  {analysisConfig.map((group) => (
                    <button
                      key={group.groupId}
                      type="button"
                      onClick={() => handleScrollTo(group.groupId)}
                      className={`text-left px-5 py-3 text-sm font-medium transition-all border-l-4 ${
                        expanded === group.groupId
                          ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-inner'
                          : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {group.title}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-white relative scroll-smooth">

                <div className="max-w-5xl mx-auto pb-24">
                  {analysisConfig.map((group) => (
                    <div
                      key={group.groupId}
                      id={group.groupId}
                      className="mb-12 pt-4"
                    >
                      <h2 className="text-lg font-bold text-slate-800 mb-5 pb-2 border-b-2 border-slate-100 uppercase tracking-wide">
                        {group.title}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-2">
                        {group.fields.map((field) => (
                          <PrimitiveInput key={field.id} id={field.id} label={field.label} type={field.type} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </form>
          </FormProvider>
        </div>
    </div>
  );
};
