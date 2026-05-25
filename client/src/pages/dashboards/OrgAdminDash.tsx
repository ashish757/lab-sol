import { useSelector } from 'react-redux';
import { useGetOrganizationByIdQuery, useCreateUnitMutation, useInviteUserMutation } from '../../store/api/apiSlice';
import { Users, Network, Mail, Building, Plus, X } from 'lucide-react';
import type { RootState } from '../../store/store';
import { useState } from 'react';

export const OrgAdminDash = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: org, isLoading, error } = useGetOrganizationByIdQuery(user?.orgId as string, {
    skip: !user?.orgId,
  });
  const [createUnit] = useCreateUnitMutation();
  const [inviteUser] = useInviteUserMutation();

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [unitName, setUnitName] = useState('');

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({ email: '', role: 'UNIT_OPERATOR', unitId: '' });

  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUnit({ name: unitName }).unwrap();
      setIsUnitModalOpen(false);
      setUnitName('');
      alert('Unit created successfully!');
    } catch (err) {
      alert('Failed to create unit');
      console.error(err);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { orgId: user?.orgId, email: userForm.email, role: userForm.role };
      if (userForm.role === 'UNIT_OPERATOR') {
        payload.unitId = userForm.unitId;
      }
      await inviteUser(payload).unwrap();
      setIsUserModalOpen(false);
      setUserForm({ email: '', role: 'UNIT_OPERATOR', unitId: '' });
      alert('User invitation sent!');
    } catch (err) {
      alert('Failed to invite user');
      console.error(err);
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
              <span className="font-bold text-emerald-900">{org.users?.length || 0} Users</span>
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

      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Create Factory Unit</h2>
              <button onClick={() => setIsUnitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUnitSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit Name</label>
                <input
                  type="text"
                  required
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Acme Alpha"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsUnitModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">Create Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Invite User</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="UNIT_OPERATOR">Unit Operator</option>
                  <option value="ORG_STAFF">Organization Staff</option>
                </select>
              </div>
              {userForm.role === 'UNIT_OPERATOR' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Unit</label>
                  <select
                    required
                    value={userForm.unitId}
                    onChange={(e) => setUserForm({ ...userForm, unitId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="" disabled>Select a unit</option>
                    {org.units?.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
