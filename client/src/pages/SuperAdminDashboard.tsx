import { useState } from 'react';
import { useInviteOrganizationMutation } from '../store/api/apiSlice';

export const SuperAdminDashboard = () => {
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [inviteOrg, { isLoading: loading }] = useInviteOrganizationMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const organizationSetupPayload: any = { orgName, email };
      if (orgId.trim() !== '') {
        organizationSetupPayload.orgId = orgId;
      }
      const response = await inviteOrg(organizationSetupPayload).unwrap();

      if (response?.success) {
        setSuccess(true);
        setOrgName('');
        setOrgId('');
        setEmail('');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to invite organization');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto p-8">
      <div className="max-w-md mx-auto w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Invite Organization</h1>
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-semibold">
            Organization invited successfully.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="orgName" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Organization Name
            </label>
            <input
              id="orgName"
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="orgId" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Organization ID (Optional)
            </label>
            <input
              id="orgId"
              type="text"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              placeholder="Leave empty to auto-generate"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all uppercase tracking-widest shadow-md shadow-indigo-600/10"
          >
            {loading ? 'Inviting...' : 'Send Invite'}
          </button>
        </form>
      </div>
    </div>
  );
};
