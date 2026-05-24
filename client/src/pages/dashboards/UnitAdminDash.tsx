import { useSelector } from 'react-redux';
import { useGetUnitByIdQuery } from '../../store/api/apiSlice';
import { Users, Mail, Network, ShieldCheck } from 'lucide-react';
import type { RootState } from '../../store/store';

export const UnitAdminDash = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: unit, isLoading, error } = useGetUnitByIdQuery(user?.unitId as string, {
    skip: !user?.unitId,
  });

  if (isLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 shadow-md"></div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="p-8 h-full flex items-center justify-center text-red-500">
        <p>Failed to load unit details. Ensure you are assigned to a factory unit.</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-slate-50">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-semibold tracking-wide uppercase">
              <ShieldCheck size={16} className="text-emerald-500" />
              {unit.org.name}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Network size={28} className="text-indigo-600" />
              {unit.name}
            </h1>
            <p className="text-slate-500 mt-1 font-mono text-xs">Unit ID: {unit.id}</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
              <Users size={18} className="text-emerald-600" />
              <span className="font-bold text-emerald-900">{unit.users?.length || 0} Registered Personnel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-emerald-600" />
            Unit Personnel
          </h2>
        </div>
        <div className="p-0 overflow-y-auto max-h-[600px]">
          {unit.users?.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {unit.users.map((u: any) => (
                <li key={u.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={16} className="text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-900">{u.email}</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">ID: {u.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      u.role === 'UNIT_ADMIN' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-slate-500">No personnel registered in this unit.</div>
          )}
        </div>
      </div>
    </div>
  );
};
