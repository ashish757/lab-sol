import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrganizationByIdQuery } from '../../store/api/apiSlice';
import { ArrowLeft, Users, Network, Mail } from 'lucide-react';
import { getPagePath } from '../../config/routesConfig';

export const SuperAdminOrgDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: org, isLoading, error } = useGetOrganizationByIdQuery(id as string, {
    skip: !id,
  });

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
        <p>Failed to load organization details.</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(getPagePath.adminDashboard())}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{org.name}</h1>
            <p className="text-slate-500 mt-1 font-mono text-xs">ID: {org.id}</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2">
              <Network size={18} className="text-indigo-600" />
              <span className="font-bold text-indigo-900">{org.units?.length || 0} Units</span>
            </div>
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
              <Users size={18} className="text-emerald-600" />
              <span className="font-bold text-emerald-900">{org.users?.length || 0} Users</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Units Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Network size={20} className="text-indigo-600" />
              Factory Units
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[600px]">
            {org.units?.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {org.units.map((unit: any) => (
                  <li key={unit.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <h3 className="text-base font-bold text-slate-900">{unit.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">{unit.id}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500">No units registered for this organization.</div>
            )}
          </div>
        </div>

        {/* Users Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users size={20} className="text-emerald-600" />
              Registered Users
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[600px]">
            {org.users?.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {org.users.map((user: any) => (
                  <li key={user.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={16} className="text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-900">{user.email}</h3>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">ID: {user.id}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        user.role === 'ORG_ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'UNIT_ADMIN' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500">No users registered for this organization.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
