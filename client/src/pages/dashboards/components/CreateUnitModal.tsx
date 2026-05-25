import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateUnitMutation } from '../../../store/api/apiSlice';

interface CreateUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUnitModal: React.FC<CreateUnitModalProps> = ({ isOpen, onClose }) => {
  const [createUnit] = useCreateUnitMutation();
  const [unitName, setUnitName] = useState('');

  if (!isOpen) return null;

  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUnit({ name: unitName }).unwrap();
      onClose();
      setUnitName('');
      alert('Unit created successfully!');
    } catch (err) {
      alert('Failed to create unit');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Create Factory Unit</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">Create Unit</button>
          </div>
        </form>
      </div>
    </div>
  );
};
