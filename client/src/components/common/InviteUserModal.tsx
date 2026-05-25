import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useInviteUserMutation } from '../../store/api/apiSlice';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: { id: string; name: string }[];
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, units }) => {
  const [inviteUser] = useInviteUserMutation();
  const [userForm, setUserForm] = useState({ email: '', role: 'UNIT_OPERATOR', unitId: '' });

  if (!isOpen) return null;

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { email: userForm.email, role: userForm.role };
      if (userForm.role === 'UNIT_OPERATOR') {
        payload.unitId = userForm.unitId;
      }
      await inviteUser(payload).unwrap();
      onClose();
      setUserForm({ email: '', role: 'UNIT_OPERATOR', unitId: '' });
      alert('User invitation sent!');
    } catch (err) {
      alert('Failed to invite user');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Invite User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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
                {units?.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">Send Invitation</button>
          </div>
        </form>
      </div>
    </div>
  );
};
