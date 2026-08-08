import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { useGetOrganizationByIdQuery, useGetActiveSessionQuery } from '../../store/api/apiSlice';
import { Settings, ArrowRight, Lock, Unlock, AlertCircle } from 'lucide-react';

const UnitSessionCard = ({ unit }: { unit: any }) => {
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetActiveSessionQuery(unit.id);
  const isLocked = session?.isLocked;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 transition-colors flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${isLocked ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">{unit.name}</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isLoading ? 'Loading session...' : isLocked ? 'Session Locked' : 'No Active Session'}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate(`/org/dash/unit/${unit.id}/settings`)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-[0.98] ${
          isLocked 
            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-transparent shadow-indigo-500/20'
        }`}
      >
        {isLocked ? 'View Session Data' : 'Start Session'}
        <ArrowRight size={16} className={isLocked ? 'text-slate-400' : 'text-indigo-200'} />
      </button>
    </div>
  );
};

export const OrgAdminSettingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { data: org, isLoading, error } = useGetOrganizationByIdQuery(user?.orgId as string, {
    skip: !user?.orgId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="p-8 flex-1 flex flex-col">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-semibold text-sm">Failed to load organization settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
      <main className="max-w-4xl mx-auto px-8 py-10 w-full flex-1 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-500/20">
              <Settings size={20} className="text-white" />
            </div>
            Organization Settings
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Manage global settings and active sessions for all manufacturing units within {org.name}.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">Unit Sessions</h2>
          {org.units?.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-500">
              No units found in this organization.
            </div>
          ) : (
            <div className="grid gap-4">
              {org.units?.map((unit: any) => (
                <UnitSessionCard key={unit.id} unit={unit} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
