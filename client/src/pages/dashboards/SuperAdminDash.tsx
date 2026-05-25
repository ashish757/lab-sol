import { useNavigate } from 'react-router-dom';
import { useGetOrganizationsQuery, useInviteOrganizationMutation } from '../../store/api/apiSlice';
import { getPagePath } from '../../config/routesConfig';
import { Building2, Users, Network, Plus, X } from 'lucide-react';
import { useState } from 'react';

export const SuperAdminDash = () => {
  const { data: orgs, isLoading } = useGetOrganizationsQuery({});
  const [inviteOrganization] = useInviteOrganizationMutation();
  const navigate = useNavigate();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ orgName: '', orgId: '', contactEmail: '' });

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteOrganization(inviteForm).unwrap();
      setIsInviteModalOpen(false);
      setInviteForm({ orgName: '', orgId: '', contactEmail: '' });
      alert('Invitation sent successfully!');
    } catch (err) {
      alert('Failed to send invitation');
      console.error(err);
    }
  };

  return (
    <div className="p-8 w-full h-full overflow-y-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Super Administrator Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage organizations, factory units, and organizational admins across the entire network.</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
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

      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Invite Organization</h2>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={inviteForm.orgName}
                  onChange={(e) => setInviteForm({ ...inviteForm, orgName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization ID (Optional)</label>
                <input
                  type="text"
                  value={inviteForm.orgId}
                  onChange={(e) => setInviteForm({ ...inviteForm, orgId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Leave empty to auto-generate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={inviteForm.contactEmail}
                  onChange={(e) => setInviteForm({ ...inviteForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="admin@acme.com"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
