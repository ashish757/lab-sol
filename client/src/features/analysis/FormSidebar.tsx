import type { GroupConfig } from './analysisConfig';
import { FormProgress } from './FormProgress';

interface FormSidebarProps {
  config: GroupConfig[];
  activeSection: string;
  onScrollTo: (groupId: string) => void;
}

export const FormSidebar = ({ config, activeSection, onScrollTo }: FormSidebarProps) => {
  return (
    <nav className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto z-0 flex-shrink-0 flex flex-col">
      {/* Top Actions & Live Progress Panel */}
      <div className="p-5 border-b border-slate-200 bg-white/60 flex flex-col gap-4 sticky top-0 z-10 backdrop-blur-md">
        <FormProgress className="w-full select-none flex flex-col gap-2" />
        <button
          type="submit"
          className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-md shadow-sm shadow-blue-500/10 transition-all text-center select-none cursor-pointer"
        >
          Generate Report
        </button>
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
