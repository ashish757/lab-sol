import type { GroupConfig } from './analysisConfig';

interface FormSidebarProps {
  config: GroupConfig[];
  activeSection: string;
  onScrollTo: (groupId: string) => void;
}

export const FormSidebar = ({ config, activeSection, onScrollTo }: FormSidebarProps) => {
  return (
    <nav className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto z-0 flex-shrink-0 flex flex-col py-4">
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
    </nav>
  );
};
