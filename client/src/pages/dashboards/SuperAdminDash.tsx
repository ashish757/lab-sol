import { useNavigate } from 'react-router-dom';
import { useGetOrganizationsQuery } from '../../store/api/apiSlice';
import { getPagePath } from '../../config/routesConfig';
import { Building2, Users, Network } from 'lucide-react';

export const SuperAdminDash = () => {
  const { data: orgs, isLoading } = useGetOrganizationsQuery({});
  const navigate = useNavigate();

  return (
    <div className="p-8 w-full h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Super Administrator Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage organizations, factory units, and organizational admins across the entire network.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orgs?.map((org: any) => (
            <div key={org.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Building2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{org.name}</h3>
                <p className="text-sm text-slate-500 mb-6 font-mono text-xs">{org.id}</p>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Network size={18} className="text-indigo-400" />
                    <span className="font-semibold text-slate-800">{org._count?.units || 0}</span>
                    <span className="text-sm">Units</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={18} className="text-emerald-400" />
                    <span className="font-semibold text-slate-800">{org._count?.users || 0}</span>
                    <span className="text-sm">Users</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => navigate(getPagePath.adminOrgDetails(org.id))}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-200 w-full"
                >
                  View Details & Management
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
