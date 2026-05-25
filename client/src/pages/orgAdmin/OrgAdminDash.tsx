import { useSelector } from 'react-redux';
import { useGetOrganizationByIdQuery, useCancelUserInviteMutation, useInviteUserMutation } from '../../store/api/apiSlice';
import { Users, Network, Mail, Building, Plus, Trash2, RefreshCw } from 'lucide-react';
import type { RootState } from '../../store/store';
import { useState } from 'react';
import { CreateUnitModal } from '../../components/common/CreateUnitModal';
import { InviteUserModal } from '../../components/common/InviteUserModal';

export const OrgAdminDash = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: org, isLoading, error } = useGetOrganizationByIdQuery(user?.orgId as string, {
    skip: !user?.orgId,
  });
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [cancelInvite, { isLoading: isCancelling }] = useCancelUserInviteMutation();
  const [resendInvite, { isLoading: isResending }] = useInviteUserMutation();

  const handleCancelInvite = async (tokenId: string) => {
    if (confirm('Are you sure you want to cancel this user invitation?')) {
      try {
        await cancelInvite(tokenId).unwrap();
        alert('Invitation cancelled successfully.');
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to cancel invitation');
      }
    }
  };

  const handleResendInvite = async (invite: any) => {
    try {
      const payload: any = { email: invite.email, role: invite.role };
      if (invite.role === 'UNIT_OPERATOR') {
        payload.unitId = invite.unitId;
      }
      await resendInvite(payload).unwrap();
      alert('Invitation resent successfully.');
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to resend invitation');
    }
  };

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

  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-slate-50">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Building size={28} className="text-indigo-600" />
              {org.name}
            </h1>
            <p className="text-slate-500 mt-1 font-mono text-xs">Organization ID: {org.id}</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Network size={20} className="text-indigo-600" />
              Factory Units
            </h2>
            {user?.role === 'ORG_ADMIN' && (
              <button
                onClick={() => setIsUnitModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-md text-sm transition-colors"
              >
                <Plus size={16} />
                Add Unit
              </button>
            )}
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

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users size={20} className="text-emerald-600" />
              Registered Users
            </h2>
            {user?.role === 'ORG_ADMIN' && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold rounded-md text-sm transition-colors"
              >
                <Plus size={16} />
                Invite User
              </button>
            )}
          </div>
          <div className="p-0 overflow-y-auto max-h-[600px]">
            {allUsers.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {allUsers.map((user: any) => (
                  <li key={user.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={16} className="text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-900">{user.email}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${
                          user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">ID: {user.id}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md w-fit ${
                        user.role === 'ORG_ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'UNIT_OPERATOR' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                      {user.isInvite && (
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => handleCancelInvite(user.id)}
                            disabled={isCancelling}
                            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                          <button
                            onClick={() => handleResendInvite(user)}
                            disabled={isResending}
                            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            <RefreshCw size={14} /> Resend
                          </button>
                        </div>
                      )}
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

      <CreateUnitModal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} />
      <InviteUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} units={org.units || []} />
    </div>
  );
};
