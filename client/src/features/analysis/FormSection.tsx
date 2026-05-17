import React from 'react';
import { type GroupConfig } from './analysisConfig';
import { PrimitiveInput } from './PrimitiveInputs';

interface FormSectionProps {
  group: GroupConfig;
}

export const FormSection = React.memo(({ group }: FormSectionProps) => {
  return (
    <div
      id={group.groupId}
      className="mb-12 pt-4"
    >
      <h2 className="text-lg font-bold text-slate-800 mb-5 pb-2 border-b-2 border-slate-100 uppercase tracking-wide">
        {group.title}
      </h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse min-w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-2 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3 md:w-1/4 lg:w-1/3">Parameter</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4 md:w-1/6">UOM</th>
              <th className="py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-auto">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {(() => {
              const grouped: { label: string; fields: typeof group.fields }[] = [];
              group.fields.forEach(field => {
                const label = field.label.trim();
                const existing = grouped.find(g => g.label === label);
                if (existing) {
                  existing.fields.push(field);
                } else {
                  grouped.push({ label, fields: [field] });
                }
              });
              return grouped.map(({ label, fields }) => (
                <PrimitiveInput key={label} label={label} fields={fields} groupId={group.groupId} />
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
});
