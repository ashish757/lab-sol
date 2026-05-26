import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useGetOrganizationByIdQuery, useGetUnitByIdQuery } from '../store/api/apiSlice';
import { User, Mail, Shield, Building2, Factory } from 'lucide-react';
import { Role } from '../types/auth';

export const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: organization, isLoading: isOrgLoading } = useGetOrganizationByIdQuery(
    user?.orgId as string,
    { skip: !user?.orgId }
  );

  const { data: unit, isLoading: isUnitLoading } = useGetUnitByIdQuery(
    user?.unitId as string,
    { skip: !user?.unitId }
  );

  const formatRole = (role: string) => {
    switch (role) {
      case Role.SUPER_ADMIN: return 'Super Admin';
      case Role.ORG_ADMIN: return 'Organization Admin';
      case Role.ORG_STAFF: return 'Organization Staff';
      case Role.UNIT_OPERATOR: return 'Unit Operator';
      default: return role;
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50">
        <p className="text-slate-500 font-medium">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50">
      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl p-8 lg:p-10 border border-slate-900">
          <div className="absolute -right-32 -top-32 w-[30rem] h-[30rem] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />
          <div className="absolute -left-32 -bottom-32 w-[30rem] h-[30rem] rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center border-4 border-slate-900 shadow-xl overflow-hidden">
              <span className="text-5xl font-black text-white select-none">
                {user.email[0].toUpperCase()}
              </span>
            </div>
            
            <div className="flex flex-col items-center sm:items-start flex-1 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">
                <Shield size={14} />
                {formatRole(user.role)}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
                My Profile
              </h1>
              <p className="text-slate-400 font-medium flex items-center gap-2">
                <Mail size={16} />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col gap-6 relative overflow-hidden group">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Account Details</h2>
                <p className="text-xs text-slate-500 font-medium">Your personal credentials</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
                <span className="text-sm font-semibold text-slate-900">{user.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account ID</span>
                <span className="text-sm font-mono text-slate-600 truncate bg-slate-50 p-2 rounded border border-slate-100">{user.id}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Level</span>
                <span className="text-sm font-semibold text-slate-900">{formatRole(user.role)}</span>
              </div>
            </div>
          </div>

          {/* Affiliation Details */}
          {(user.orgId || user.unitId) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col gap-6 relative overflow-hidden group">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Affiliations</h2>
                  <p className="text-xs text-slate-500 font-medium">Your organization and unit</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {user.orgId && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</span>
                      {isOrgLoading ? (
                        <div className="h-5 w-32 bg-slate-200 animate-pulse rounded mt-1" />
                      ) : (
                        <span className="text-sm font-bold text-slate-900 mt-0.5">{organization?.name || unit?.org?.name || 'Unknown Organization'}</span>
                      )}
                    </div>
                  </div>
                )}

                {user.unitId && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Factory size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit</span>
                      {isUnitLoading ? (
                        <div className="h-5 w-32 bg-slate-200 animate-pulse rounded mt-1" />
                      ) : (
                        <span className="text-sm font-bold text-slate-900 mt-0.5">{unit?.name || 'Unknown Unit'}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
