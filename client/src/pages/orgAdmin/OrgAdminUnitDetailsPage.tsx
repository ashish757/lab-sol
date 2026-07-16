import { useParams, useNavigate } from 'react-router-dom';
import { useGetUnitByIdQuery, useFetchUnitLogsQuery, useUpdateUnitMutation, useDeleteUnitMutation } from '../../store/api/apiSlice';
import { Building, ArrowLeft, Users, Calendar, Clock, Lock, FileText, Settings, ShieldCheck, Mail, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useModal } from '../../hooks/useModal';

export const OrgAdminUnitDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showModal, ModalComponent } = useModal();
  
  const { data: unit, isLoading: isUnitLoading, error: unitError } = useGetUnitByIdQuery(id as string, {
    skip: !id,
  });

  const { data: logs = [], isLoading: isLogsLoading } = useFetchUnitLogsQuery(id as string, {
    skip: !id,
  });

  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();

  if (isUnitLoading || isLogsLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 shadow-md"></div>
      </div>
    );
  }

  if (unitError || !unit) {
    return (
      <div className="p-8 h-full flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Failed to load unit details.</p>
          <button onClick={() => navigate('/org/dash')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">Go Back</button>
        </div>
      </div>
    );
  }


  const handleUpdateUnit = async () => {
    const newName = await showModal({
      type: 'prompt',
      inputType: 'text',
      title: 'Rename Unit',
      message: 'Enter a new name for the factory unit:',
      inputLabel: 'Unit Name',
      defaultValue: unit.name,
      confirmText: 'Save Name'
    });
    
    if (newName && newName !== unit.name) {
      try {
        await updateUnit({ id: unit.id, data: { name: newName } }).unwrap();
        await showModal({ type: 'alert', title: 'Success', message: 'Unit renamed successfully.' });
      } catch (err: any) {
        await showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to update unit' });
      }
    }
  };

  const handleDeleteUnit = async () => {
    const confirmDelete = await showModal({
      type: 'confirm',
      title: 'Remove Unit',
      message: 'Are you sure you want to permanently remove this unit?\\nAll associated data, including daily logs, will be permanently deleted.',
      confirmText: 'Delete Unit'
    });
    if (confirmDelete) {
      try {
        await deleteUnit(unit.id).unwrap();
        navigate('/org/dash');
      } catch (err: any) {
        await showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to delete unit' });
      }
    }
  };

  const sortedLogs = [...logs].sort((a, b) => {
    const d1 = new Date(b.createdAt || (b as any).date || (b as any).logDate).getTime();
    const d2 = new Date(a.createdAt || (a as any).date || (a as any).logDate).getTime();
    return d1 - d2;
  });

  const staffMembers = unit.users || [];

  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-slate-50">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/org/dash')}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building size={20} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Unit Details</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{unit.name}</h1>
              <button 
                onClick={handleUpdateUnit}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
                title="Rename Unit"
              >
                <Edit2 size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 shadow-sm">
            <Users size={18} className="text-indigo-600" />
            <span className="font-bold text-slate-700">{staffMembers.length} Staff</span>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 shadow-sm">
            <FileText size={18} className="text-emerald-600" />
            <span className="font-bold text-slate-700">{logs.length} Logs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Season Settings Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-amber-600" />
                Season Settings
              </h2>
              <button
                onClick={() => navigate(`/org/dash/unit/${unit.id}/settings`)}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                title="Edit Season Settings"
              >
                <Settings size={18} />
                Manage
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Start Date</span>
                {unit.seasonStartDate ? (
                  <div className="flex items-center gap-2 text-lg font-black text-slate-800">
                    {unit.seasonStartDate}
                    <Lock size={14} className="text-indigo-500" />
                  </div>
                ) : (
                  <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">Not Set</span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">End Date</span>
                {unit.seasonEndDate ? (
                  <div className="flex items-center gap-2 text-lg font-black text-slate-800">
                    {unit.seasonEndDate}
                    <Lock size={14} className="text-indigo-500" />
                  </div>
                ) : (
                  <span className="text-sm font-medium text-slate-400 italic">Not Set</span>
                )}
              </div>
            </div>
          </div>

          {/* Staff Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-indigo-600" />
                Assigned Staff
              </h2>
            </div>
            <div className="p-0 overflow-y-auto max-h-[400px]">
              {staffMembers.length > 0 ? (
                <ul className="flex flex-col">
                  {staffMembers.map((staff: any) => (
                    <li key={staff.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-800">{staff.email}</span>
                        </div>
                      </div>
                      <div className="flex">
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                          {staff.role.replace('_', ' ')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-slate-500 text-sm font-medium">No staff assigned to this unit.</div>
              )}
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white border border-red-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                Danger Zone
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Delete Unit</h3>
                  <p className="text-xs text-slate-500 mt-1">Permanently remove this unit and all its data. This action cannot be undone.</p>
                </div>
                <button
                  onClick={handleDeleteUnit}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                  Delete Unit
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Logs */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock size={20} className="text-emerald-600" />
                Recent Daily Logs
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-md">
                Total: {logs.length}
              </span>
            </div>
            <div className="p-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {sortedLogs.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 sticky top-0 backdrop-blur-md border-b border-slate-200 z-10">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Log Date</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLogs.map((log: any) => {
                      const logDate = log.createdAt || log.date || log.logDate;
                      const dateStr = logDate ? new Date(logDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown';
                      
                      return (
                        <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-800">{dateStr}</span>
                          </td>
                          <td className="px-6 py-4">
                            {log.status === 'LOCKED' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-wide">
                                <Lock size={12} /> Locked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-wide">
                                <FileText size={12} /> Draft
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {log.updatedByName || log.updatedByEmail ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">{log.updatedByName || log.updatedByEmail}</span>
                                {log.updatedByName && log.updatedByEmail && (
                                  <span className="text-xs text-slate-400">{log.updatedByEmail}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-slate-400 italic">Unknown</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FileText size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">No logs found</h3>
                  <p className="text-sm text-slate-500 max-w-sm">Operators have not uploaded any daily logs for this unit yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <ModalComponent />
    </div>
  );
};
