import { useSelector } from 'react-redux';
import { useGetOrganizationByIdQuery, useCancelUserInviteMutation, useInviteUserMutation, useUpdateUnitMutation, useDeleteUnitMutation, useUpdateUserMutation } from '../../store/api/apiSlice';
import { Users, Network, Mail, Building, Plus, Trash2, RefreshCw, MoreVertical, Search, Filter } from 'lucide-react';
import type { RootState } from '../../store/store';
import { useState } from 'react';
import { CreateUnitModal } from '../../components/common/CreateUnitModal';
import { InviteUserModal } from '../../components/common/InviteUserModal';

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

const UnitListItem = ({ unit, openDropdown, setOpenDropdown, onUpdate, onDelete }: { unit: any, openDropdown: string | null, setOpenDropdown: (id: string | null) => void, onUpdate: (unit: any) => void, onDelete: (id: string) => void }) => {
  const isDropdownOpen = openDropdown === unit.id;
  
  return (
    <li className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 border-b border-slate-100 last:border-0 relative">
      <div>
        <h3 className="text-base font-bold text-slate-900">{unit.name}</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Last Log: Today</p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setOpenDropdown(isDropdownOpen ? null : unit.id)}
          className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <MoreVertical size={16} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-8 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10">
            <button onClick={() => { setOpenDropdown(null); onUpdate(unit); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Edit Name</button>
            <button onClick={() => { setOpenDropdown(null); onDelete(unit.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Remove</button>
          </div>
        )}
      </div>
    </li>
  );
};

const UserListItem = ({ user, handleCancelInvite, handleResendInvite, isCancelling, isResending, openDropdown, setOpenDropdown, onRoleChange, onUnitChange, onDeactivate }: any) => {
  const isDropdownOpen = openDropdown === user.id;

  return (
    <li className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 last:border-0 relative">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Mail size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900">{user.email}</h3>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${
            user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {user.status}
          </span>
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
          <button 
            onClick={() => setOpenDropdown(isDropdownOpen ? null : user.id)}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
        </div>
        {user.isInvite && (
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => handleCancelInvite(user.id)}
              disabled={isCancelling}
              className="flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
            >
              <Trash2 size={12} /> Cancel
            </button>
            <button
              onClick={() => handleResendInvite(user)}
              disabled={isResending}
              className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
            >
              <RefreshCw size={12} /> Resend
            </button>
          </div>
        )}
        {isDropdownOpen && !user.isInvite && (
          <div className="absolute right-8 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10">
            <button onClick={() => { setOpenDropdown(null); onRoleChange(user); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Change Role</button>
            <button onClick={() => { setOpenDropdown(null); onUnitChange(user); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Reassign Unit</button>
            <button onClick={() => { setOpenDropdown(null); onDeactivate(user.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Deactivate</button>
          </div>
        )}
      </div>
    </li>
  );
};

export const OrgAdminDash = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: org, isLoading, error } = useGetOrganizationByIdQuery(user?.orgId as string, {
    skip: !user?.orgId,
  });
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [cancelInvite, { isLoading: isCancelling }] = useCancelUserInviteMutation();
  const [resendInvite, { isLoading: isResending }] = useInviteUserMutation();

  const [unitSearchQuery, setUnitSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();
  const [updateUser] = useUpdateUserMutation();

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

  const handleUpdateUnit = async (unit: any) => {
    const newName = prompt('Enter new name for the unit:', unit.name);
    if (newName && newName !== unit.name) {
      try {
        await updateUnit({ id: unit.id, data: { name: newName } }).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to update unit');
      }
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (confirm('Are you sure you want to remove this unit?')) {
      try {
        await deleteUnit(unitId).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete unit');
      }
    }
  };

  const handleRoleChange = async (targetUser: any) => {
    const newRole = prompt('Enter new role (ORG_ADMIN, ORG_STAFF, UNIT_OPERATOR):', targetUser.role);
    if (newRole && ['ORG_ADMIN', 'ORG_STAFF', 'UNIT_OPERATOR'].includes(newRole)) {
      try {
        await updateUser({ id: targetUser.id, data: { role: newRole } }).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to update role');
      }
    } else if (newRole) {
      alert('Invalid role specified.');
    }
  };

  const handleUnitChange = async (targetUser: any) => {
    const unitsList = org?.units?.map((u: any) => `- ${u.name}`).join('\\n') || '';
    const unitName = prompt(`Enter new Unit Name from the list below:\\n\\n${unitsList}`, targetUser.unit?.name || '');
    
    if (unitName !== null) {
      const selectedUnit = org?.units?.find((u: any) => u.name.toLowerCase() === unitName.trim().toLowerCase());
      
      if (!selectedUnit && unitName.trim() !== '') {
        alert('Unit name not found in the list. Please check your spelling.');
        return;
      }
      
      try {
        await updateUser({ id: targetUser.id, data: { unitId: selectedUnit ? selectedUnit.id : null } }).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to reassign unit');
      }
    }
  };

  const handleDeactivate = async (targetUserId: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      try {
        await updateUser({ id: targetUserId, data: { status: 'INACTIVE' } }).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to deactivate user');
      }
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

  const filteredUnits = org.units?.filter((u: any) => u.name.toLowerCase().includes(unitSearchQuery.toLowerCase())) || [];
  const filteredUsers = allUsers.filter((u: any) => {
    const matchesSearch = u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-slate-50" onClick={() => setOpenDropdown(null)}>
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
          <div className="p-0 overflow-y-auto max-h-96">
            {filteredUnits.length > 0 ? (
              <ul className="flex flex-col">
                {filteredUnits.map((unit: any) => (
                  <UnitListItem 
                    key={unit.id} 
                    unit={unit} 
                    openDropdown={openDropdown} 
                    setOpenDropdown={(id) => {
                      setTimeout(() => setOpenDropdown(id), 0);
                    }} 
                    onUpdate={handleUpdateUnit}
                    onDelete={handleDeleteUnit}
                  />
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
          <div className="p-0 overflow-y-auto max-h-96">
            {filteredUsers.length > 0 ? (
              <ul className="flex flex-col">
                {filteredUsers.map((user: any) => (
                  <UserListItem 
                    key={user.id} 
                    user={user} 
                    handleCancelInvite={handleCancelInvite} 
                    handleResendInvite={handleResendInvite} 
                    isCancelling={isCancelling} 
                    isResending={isResending} 
                    openDropdown={openDropdown}
                    setOpenDropdown={(id: string | null) => {
                      setTimeout(() => setOpenDropdown(id), 0);
                    }}
                    onRoleChange={handleRoleChange}
                    onUnitChange={handleUnitChange}
                    onDeactivate={handleDeactivate}
                  />
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500 font-medium">No users found matching criteria.</div>
            )}
          </div>
        </div>
      </div>

      <CreateUnitModal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} />
      <InviteUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} units={org.units || []} />
    </div>
  );
};
