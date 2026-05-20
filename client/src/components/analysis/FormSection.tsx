import React from 'react';
import { type GroupConfig, type SubGroupConfig, isFlatGroup } from '../../config/analysisConfig';
import { PrimitiveInput } from './PrimitiveInputs';

interface SubGroupSectionProps {
  subGroup: SubGroupConfig;
}

const SubGroupSection = React.memo(({ subGroup }: SubGroupSectionProps) => {
  const grouped: { label: string; fields: typeof subGroup.fields }[] = [];
  subGroup.fields.forEach((field) => {
    const label = field.label.trim();
    const existing = grouped.find((g) => g.label === label);
    if (existing) {
      existing.fields.push(field);
    } else {
      grouped.push({ label, fields: [field] });
    }
  });

  return (
    <div id={subGroup.subGroupId} className="mb-6 pt-2">
      <h3 className="text-xs font-black text-slate-600 mb-1 pb-2 uppercase tracking-wider flex items-center gap-2">
        <span className="w-1 h-2.5 bg-indigo-400 rounded-sm" />
        {subGroup.title}
      </h3>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="py-3 pl-4 text-[10px] font-black text-slate-200 uppercase tracking-widest w-1/3 md:w-1/4 lg:w-1/3 select-none">Parameter</th>
              <th className="py-3 px-4 text-[10px] font-black text-slate-200 uppercase tracking-widest w-1/4 md:w-1/6 select-none">UOM</th>
              <th className="py-3 pr-4 text-[10px] font-black text-slate-200 uppercase tracking-widest w-auto select-none">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {grouped.map(({ label, fields }) => (
              <PrimitiveInput key={label} label={label} fields={fields} groupId={subGroup.subGroupId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

interface FormSectionProps {
  group: GroupConfig;
}

export const FormSection = React.memo(({ group }: FormSectionProps) => {
  if (isFlatGroup(group)) {
    const grouped: { label: string; fields: typeof group.fields }[] = [];
    group.fields.forEach((field) => {
      const label = field.label.trim();
      const existing = grouped.find((g) => g.label === label);
      if (existing) {
        existing.fields.push(field);
      } else {
        grouped.push({ label, fields: [field] });
      }
    });

    return (
      <div id={group.groupId} className="mb-8 pt-4">
        <h2 className="text-sm font-black text-slate-800 mb-1 pb-2 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-3 bg-indigo-600 rounded-sm" />
          {group.title}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse min-w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="py-3 pl-4 text-[10px] font-black text-slate-200 uppercase tracking-widest w-1/3 md:w-1/4 lg:w-1/3 select-none">Parameter</th>
                <th className="py-3 px-4 text-[10px] font-black text-slate-200 uppercase tracking-widest w-1/4 md:w-1/6 select-none">UOM</th>
                <th className="py-3 pr-4 text-[10px] font-black text-slate-200 uppercase tracking-widest w-auto select-none">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {grouped.map(({ label, fields }) => (
                <PrimitiveInput key={label} label={label} fields={fields} groupId={group.groupId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 pt-4">
      <h2 className="text-sm font-black text-slate-800 mb-3 pb-2 uppercase tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-3 bg-violet-600 rounded-sm" />
        {group.title}
      </h2>
      <div className="pl-3 border-l-2 border-violet-100 flex flex-col">
        {group.subGroups.map((subGroup) => (
          <SubGroupSection key={subGroup.subGroupId} subGroup={subGroup} />
        ))}
      </div>
    </div>
  );
});

