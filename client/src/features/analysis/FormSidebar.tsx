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
    <nav className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto z-0 flex-shrink-0 flex flex-col">
      {/* Top Actions & Live Progress Panel */}
      <div className="p-5 border-b border-slate-200 bg-white/60 flex flex-col gap-4 sticky top-0 z-10 backdrop-blur-md">
        <FormProgress className="w-full select-none flex flex-col gap-2" />
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-md shadow-sm shadow-blue-500/10 transition-all text-center select-none cursor-pointer"
          >
            Generate Report
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            {onSaveDraft && (
              <button
                type="button"
                onClick={onSaveDraft}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100/80 active:scale-[0.97] text-blue-700 text-xs font-semibold rounded-md border border-blue-100 transition-all text-center select-none cursor-pointer"
              >
                Save Draft
              </button>
            )}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.97] text-slate-600 text-xs font-semibold rounded-md border border-slate-200/50 transition-all text-center select-none cursor-pointer"
              >
                Reset Form
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex flex-col py-4">
        {config.map((group) => (
          <button
            key={group.groupId}
            type="button"
            onClick={() => onScrollTo(group.groupId)}
            className={`text-left px-5 py-3 text-sm font-medium transition-all border-l-4 ${
              activeSection === group.groupId
                ? 'bg-blue-50/80 text-blue-700 border-blue-600 shadow-inner'
                : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {group.title}
          </button>
        ))}
      </div>
    </nav>
  );
};
