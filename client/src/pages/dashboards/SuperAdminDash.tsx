import { useNavigate } from 'react-router-dom';
import { useGetOrganizationsQuery, useCancelOrganizationInviteMutation } from '../../store/api/apiSlice';
import { getPagePath, PAGES } from '../../config/routesConfig';
import { Building2, Users, Network, Plus, Trash2, Mail } from 'lucide-react';

export const SuperAdminDash = () => {
  const { data: orgs, isLoading } = useGetOrganizationsQuery({});
  const [cancelInvite, { isLoading: isCancelling }] = useCancelOrganizationInviteMutation();
  const navigate = useNavigate();

  const addOrg = () => {
    navigate(PAGES.SUPER_ADMIN_INVITE);
  }

  const handleCancelInvite = async (id: string) => {
    if (confirm('Are you sure you want to cancel this organization invitation?')) {
      try {
        await cancelInvite(id).unwrap();
        alert('Invitation cancelled successfully.');
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to cancel invitation');
      }
    }
  }

  return (
    <div className="p-8 w-full h-full overflow-y-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Super Administrator Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage organizations, factory units, and organizational admins across the entire network.</p>
        </div>
        <button
          onClick={addOrg}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200"
        >
          <Plus size={18} />
          Invite Organization
        </button>
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
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-slate-900">{org.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                    org.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {org.status}
                  </span>
                </div>
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
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-2">
                {org.status === 'INACTIVE' ? (
                  <>
                    <button 
                      onClick={() => handleCancelInvite(org.id)}
                      disabled={isCancelling}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-lg shadow-sm transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      Cancel
                    </button>
                    <button 
                      onClick={() => navigate(PAGES.SUPER_ADMIN_INVITE, { state: { initialOrgName: org.name, initialOrgId: org.id } })}
                      className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-lg shadow-sm transition-colors duration-200"
                    >
                      <Mail size={16} />
                      Re-invite
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => navigate(getPagePath.adminOrgDetails(org.id))}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-200 w-full"
                  >
                    View Details & Management
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
