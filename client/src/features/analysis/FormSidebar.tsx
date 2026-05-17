import type { GroupConfig } from './analysisConfig';
import { FormProgress } from './FormProgress';

interface FormSidebarProps {
  config: GroupConfig[];
  activeSection: string;
  onScrollTo: (groupId: string) => void;
  onReset?: () => void;
  onSaveDraft?: () => void;
}

export const FormSidebar = ({ config, activeSection, onScrollTo, onReset, onSaveDraft }: FormSidebarProps) => {
  return (
    <nav className="w-full lg:w-60 bg-white border-r border-slate-200 overflow-y-auto z-0 flex-shrink-0 flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 shrink-0">
        <h1 className="text-sm font-semibold text-slate-700">New Analysis</h1>
        <p className="text-xs text-slate-400 mt-0.5">Daily production log</p>
      </div>

      <div className="px-4 py-4 border-b border-slate-200 flex flex-col gap-3 shrink-0">
        <FormProgress className="w-full select-none flex flex-col gap-1.5" />
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white text-xs font-medium rounded transition-colors text-center select-none cursor-pointer"
          >
            Generate Report
          </button>

          <div className="grid grid-cols-2 gap-2">
            {onSaveDraft && (
              <button
                type="button"
                onClick={onSaveDraft}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 active:scale-[0.97] text-slate-600 text-xs font-medium rounded border border-slate-200 transition-colors text-center select-none cursor-pointer"
              >
                Save Draft
              </button>
            )}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 active:scale-[0.97] text-slate-500 text-xs font-medium rounded border border-slate-200 transition-colors text-center select-none cursor-pointer"
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
            className={`text-left px-5 py-2.5 text-xs font-medium transition-colors ${activeSection === group.groupId
              ? 'bg-slate-200 text-slate-900'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            {group.title}
          </button>
        ))}
      </div>
    </nav>
  );
};
