import { useSelector } from 'react-redux';
import { useGetOrganizationByIdQuery } from '../../store/api/apiSlice';
import { Users, Network, Mail, Building, Search, Filter } from 'lucide-react';
import type { RootState } from '../../store/store';
import { useState } from 'react';

const MetricCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: any, colorClass: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-between">
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{title}</span>
        <span className={`text-3xl font-black tracking-tight ${colorClass}`}>{value}</span>
      </div>
      <div className={`p-4 rounded-lg opacity-50`}>
        <Icon size={32} className={colorClass} />
      </div>
    </div>
  );
};

export const OrgStaffDash = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: org, isLoading, error } = useGetOrganizationByIdQuery(user?.orgId as string, {
    skip: !user?.orgId,
  });

  const [unitSearchQuery, setUnitSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  if (isLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 shadow-md"></div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="p-8 h-full flex items-center justify-center text-red-500">
        <p>Failed to load organization details. Ensure you are assigned to an organization.</p>
      </div>
    );
  }

  const allUsers = [
    ...(org.users || []).map((u: any) => ({ ...u, status: 'ACTIVE' })),
    ...(org.pendingInvites || []).map((i: any) => ({ ...i, status: 'PENDING', isInvite: true }))
  ];

  const filteredUnits = org.units?.filter((u: any) => u.name.toLowerCase().includes(unitSearchQuery.toLowerCase())) || [];
  const filteredUsers = allUsers.filter((u: any) => {
    const matchesSearch = u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-slate-50">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Building size={28} className="text-indigo-600" />
              {org.name}
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2">
              <Network size={18} className="text-indigo-600" />
              <span className="font-bold text-indigo-900">{org.units?.length || 0} Units</span>
            </div>
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
              <Users size={18} className="text-emerald-600" />
              <span className="font-bold text-emerald-900">{allUsers.length} Users</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Active Units" value={org.units?.length || 0} icon={Network} colorClass="text-indigo-600" />
        <MetricCard title="Staff" value={allUsers.length} icon={Users} colorClass="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Network size={20} className="text-indigo-600" />
                Factory Units
              </h2>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search units..."
                value={unitSearchQuery}
                onChange={(e) => setUnitSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="p-0 overflow-y-auto max-h-[600px]">
            {filteredUnits.length > 0 ? (
              <ul className="flex flex-col">
                {filteredUnits.map((unit: any) => (
                  <li key={unit.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 border-b border-slate-100 last:border-0">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{unit.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Last Log: Today</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500 font-medium">No units found matching criteria.</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users size={20} className="text-emerald-600" />
                Registered Users
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="relative shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-slate-400" />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-10 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer bg-white font-medium text-slate-700"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ORG_ADMIN">Org Admin</option>
                  <option value="ORG_STAFF">Org Staff</option>
                  <option value="UNIT_OPERATOR">Unit Operator</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="p-0 overflow-y-auto max-h-[600px]">
            {filteredUsers.length > 0 ? (
              <ul className="flex flex-col">
                {filteredUsers.map((user: any) => (
                  <li key={user.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 last:border-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={16} className="text-slate-400" />
                        <h3 className="text-sm font-bold text-slate-900">{user.email}</h3>
                        {user.status !== "ACTIVE" && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${
                            user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {user.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Last Login: 2 hours ago</p>
                      {user.role === 'UNIT_OPERATOR' && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wide">
                          {user.unit?.name || user.unitId || 'Unassigned'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md w-fit ${
                          user.role === 'ORG_ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'UNIT_OPERATOR' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500 font-medium">No users found matching criteria.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
