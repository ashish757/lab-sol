import { useState } from 'react';
import type { GroupConfig } from '../../config/analysisConfig';
import { isFlatGroup } from '../../config/analysisConfig';
import { FormProgress } from './FormProgress';

interface FormSidebarProps {
  config: GroupConfig[];
  activeSection: string;
  onScrollTo: (id: string) => void;
  onUploadData?: () => void;
  onLockData?: () => void;
  isSubmitting?: boolean;
  hasUnsavedChanges?: boolean;
  hasUploadedData?: boolean;
  isLocked?: boolean;
  isSequentialBlocked?: boolean;
  blockingDate?: string;
  isFillingPastData?: boolean;
  hideLockDataButton?: boolean;
}

export const FormSidebar = ({ config, activeSection, hasUploadedData, onScrollTo, onUploadData, onLockData, isSubmitting = false, hasUnsavedChanges = false, isLocked = false, blockingDate, hideLockDataButton = false }: FormSidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  return (
    <nav className="w-full md:w-72 bg-white border-r border-slate-200 overflow-y-auto z-0 flex-shrink-0 flex flex-col shadow-sm">
      <div className="px-5 py-5 border-b border-slate-200 shrink-0 bg-slate-50/40">
        <h1 className="text-lg font-black text-slate-900 tracking-wider uppercase">New Analysis</h1>
        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Daily production log</p>
      </div>

      <div className="px-5 py-5 border-b border-slate-200 flex flex-col gap-4 shrink-0 bg-slate-50">
        <FormProgress className="w-full select-none flex flex-col gap-2" />

        {hasUnsavedChanges && !isLocked && (
          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 text-center uppercase tracking-wider">
            Unsaved Changes
          </div>
        )}

        {!isLocked && !hasUploadedData && (
          <div className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-2 rounded border border-indigo-200 text-center uppercase tracking-wider leading-relaxed shadow-sm">
            Filling data for {blockingDate}
          </div>
        )}

        {!isLocked && hasUploadedData && (
          <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-2 rounded border border-emerald-200 text-center uppercase tracking-wider leading-relaxed shadow-sm">
            Draft saved for {blockingDate}
          </div>
        )}

        {isLocked && (
          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-2 rounded border border-emerald-200 text-center uppercase tracking-wider leading-relaxed">
            Log is locked & read-only
          </div>
        )}

        <div className="flex flex-col gap-2 mt-1">
          <div className={`grid ${hideLockDataButton ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-2`}>
            {onUploadData && (
              <button
                type="button"
                onClick={onUploadData}
                disabled={isLocked || isSubmitting}
                className="px-2 py-2 bg-white hover:bg-slate-50 active:scale-[0.97] text-slate-700 text-xs font-bold rounded-lg border border-slate-400 transition-all text-center select-none cursor-pointer uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Data
              </button>
            )}
            {onLockData && !hideLockDataButton && (
              <button
                type="button"
                onClick={onLockData}
                disabled={isLocked || isSubmitting}
                className="px-2 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg border border-red-300 text-center select-none cursor-pointer uppercase tracking-wide  disabled:cursor-not-allowed"
              >
                {isLocked ? "Locked" : "Lock Data"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col py-2">
        {config.map((group) => {
          if (isFlatGroup(group)) {
            return (
              <button
                key={group.groupId}
                type="button"
                onClick={() => onScrollTo(group.groupId)}
                className={`text-left px-5 py-2.5 text-xs font-medium transition-colors relative ${
                  activeSection === group.groupId
                    ? 'bg-slate-700 text-indigo-100 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {group.title}
              </button>
            );
          }

          const isParentActive = group.subGroups.some((sg) => sg.subGroupId === activeSection);
          const isExpanded = expandedGroups[group.groupId] || isParentActive;

          return (
            <div key={group.groupId}>
              <button
                type="button"
                onClick={() => toggleGroup(group.groupId)}
                className={`w-full flex items-center justify-between text-left px-5 py-2.5 text-xs font-medium transition-colors relative cursor-pointer ${
                  isParentActive ? 'text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{group.title}</span>
                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isExpanded && group.subGroups.map((subGroup) => (
                <button
                  key={subGroup.subGroupId}
                  type="button"
                  onClick={() => onScrollTo(subGroup.subGroupId)}
                  className={`w-full text-left pl-10 pr-5 py-2 text-xs font-medium transition-colors relative ${
                    activeSection === subGroup.subGroupId
                      ? 'bg-indigo-100 text-indigo-700 font-extrabold'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  {subGroup.title}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

