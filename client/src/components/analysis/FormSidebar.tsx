import type { GroupConfig } from '../../config/analysisConfig';
import { FormProgress } from './FormProgress';

interface FormSidebarProps {
  config: GroupConfig[];
  activeSection: string;
  onScrollTo: (groupId: string) => void;
  onReset?: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
}

export const FormSidebar = ({ config, activeSection, onScrollTo, onReset, onSaveDraft, isSubmitting = false }: FormSidebarProps) => {
  return (
    <nav className="w-full lg:w-64 bg-white border-r border-slate-200 overflow-y-auto z-0 flex-shrink-0 flex flex-col shadow-sm">
      <div className="px-5 py-5 border-b border-slate-200 shrink-0 bg-slate-50/40">
        <h1 className="text-lg font-black text-slate-900 tracking-wider uppercase">New Analysis</h1>
        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Daily production log</p>
      </div>

      <div className="px-5 py-5 border-b border-slate-200 flex flex-col gap-4 shrink-0 bg-slate-50">
        <FormProgress className="w-full select-none flex flex-col gap-2" />

        <div className="flex flex-col gap-2 mt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all text-center select-none cursor-pointer shadow-md shadow-indigo-600/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 uppercase tracking-wider"
          >
            {isSubmitting ? 'Saving…' : 'Generate Report'}
          </button>

          <div className="grid grid-cols-2 gap-2">
            {onSaveDraft && (
              <button
                type="button"
                onClick={onSaveDraft}
                className="px-2 py-2 bg-white hover:bg-slate-50 active:scale-[0.97] text-slate-700 text-xs font-bold rounded-lg border border-slate-400 transition-all text-center select-none cursor-pointer uppercase tracking-wide"
              >
                Save Draft
              </button>
            )}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="px-2 py-2 bg-white hover:bg-slate-50 active:scale-[0.97] text-slate-700 text-xs font-bold rounded-lg border border-slate-400 transition-all text-center select-none cursor-pointer uppercase tracking-wide"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col py-2">
        {config.map((group) => (
          <button
            key={group.groupId}
            type="button"
            onClick={() => onScrollTo(group.groupId)}
            className={`text-left px-5 py-2.5 text-xs font-medium transition-colors relative ${activeSection === group.groupId
                ? 'bg-indigo-100 text-indigo-700 font-extrabold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
              }`}
          >
            {group.title}
          </button>
        ))}
      </div>
    </nav>
  );
};
