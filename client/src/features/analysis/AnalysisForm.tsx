import { useState } from 'react';
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

  const [expanded, setExpanded] = useState<string>(analysisConfig[0].grpId);

  const onSubmit = (data: AnalysisSchema) => {
    console.log(data);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-3rem)]">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center z-10 shadow-sm">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Enterprise Analysis</h1>
            <button
              onClick={methods.handleSubmit(onSubmit)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            >
              Generate Report
            </button>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-1 overflow-hidden flex-col lg:flex-row">
              
              <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto hidden lg:block z-0">
                <nav className="flex flex-col py-4">
                  {analysisConfig.map((grp) => (
                    <button
                      key={grp.grpId}
                      type="button"
                      onClick={() => setExpanded(grp.grpId)}
                      className={`text-left px-5 py-3 text-sm font-medium transition-all border-l-4 ${
                        expanded === grp.grpId
                          ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-inner'
                          : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {grp.ttl}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-white relative">
                <div className="lg:hidden mb-6 space-y-3">
                  {analysisConfig.map((grp) => (
                    <div key={`mobile-${grp.grpId}`} className="border border-slate-200 rounded overflow-hidden bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === grp.grpId ? '' : grp.grpId)}
                        className={`w-full text-left px-4 py-3 font-semibold flex justify-between items-center transition-colors ${expanded === grp.grpId ? 'bg-blue-50 text-blue-800' : 'bg-slate-50 text-slate-700'}`}
                      >
                        <span>{grp.ttl}</span>
                        <span className="text-lg leading-none">{expanded === grp.grpId ? '−' : '+'}</span>
                      </button>
                      {expanded === grp.grpId && (
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                          {grp.flds.map((fld) => (
                            <PrimitiveInput key={fld.id} id={fld.id} lbl={fld.lbl} typ={fld.typ} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="hidden lg:block max-w-5xl mx-auto">
                  {analysisConfig.map((grp) => (
                    <div
                      key={`desktop-${grp.grpId}`}
                      className={expanded === grp.grpId ? 'block animate-in fade-in slide-in-from-bottom-2 duration-200' : 'hidden'}
                    >
                      <h2 className="text-lg font-bold text-slate-800 mb-5 pb-2 border-b-2 border-slate-100 uppercase tracking-wide">
                        {grp.ttl}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-2">
                        {grp.flds.map((fld) => (
                          <PrimitiveInput key={fld.id} id={fld.id} lbl={fld.lbl} typ={fld.typ} />
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
    </div>
  );
};
