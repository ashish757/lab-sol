import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useGetActiveSessionQuery, 
  useUpsertSessionMutation, 
  useLockSessionMutation,
  useGetUnitByIdQuery 
} from '../../store/api/apiSlice';
import type { RootState } from '../../store/store';
import { useModal } from '../../hooks/useModal';
import { Calendar, Clock, Lock, Save, ArrowLeft, AlertCircle } from 'lucide-react';

export const SessionSettingsPage = () => {
  const navigate = useNavigate();
  const { id: paramUnitId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const unitId = paramUnitId || user?.unitId;
  const orgId = user?.orgId;

  const { data: session, isLoading: isSessionLoading } = useGetActiveSessionQuery(unitId as string, {
    skip: !unitId,
  });

  const { data: unit, isLoading: isUnitLoading } = useGetUnitByIdQuery(unitId as string, {
    skip: !unitId,
  });

  const [upsertSession, { isLoading: isSaving }] = useUpsertSessionMutation();
  const [lockSession, { isLoading: isLocking }] = useLockSessionMutation();
  const { showModal, ModalComponent } = useModal();

  const [formData, setFormData] = useState({
    sessionStartDate: '',
    sessionStartTime: '',
    dayStartTime: '08:00',
    sessionOffDate: '',
    sessionOffTime: '',
    plantName: '',
    plantCode: '',
    crushingCapacity: '',
    crushingSeason: '',
  });

  useEffect(() => {
    if (session) {
      setFormData({
        sessionStartDate: session.sessionStartDate || '',
        sessionStartTime: session.sessionStartTime || '',
        dayStartTime: session.dayStartTime || '08:00',
        sessionOffDate: session.sessionOffDate || '',
        sessionOffTime: session.sessionOffTime || '',
        plantName: session.plantName || '',
        plantCode: session.plantCode || '',
        crushingCapacity: session.crushingCapacity || '',
        crushingSeason: session.crushingSeason || '',
      });
    }
  }, [session]);

  if (isSessionLoading || isUnitLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  const isLocked = session?.isLocked;
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitId || !orgId) return;

    try {
      await upsertSession({
        unitId,
        orgId,
        payload: formData,
      }).unwrap();
      showModal({ type: 'alert', title: 'Success', message: 'Session data saved successfully.' });
    } catch (err: any) {
      showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to save session data.' });
    }
  };

  const handleLock = async () => {
    if (!session?.id) {
      showModal({ type: 'alert', title: 'Error', message: 'Please save the session data first before locking.' });
      return;
    }

    if (!formData.sessionStartDate || !formData.sessionStartTime || !formData.dayStartTime) {
      showModal({ type: 'alert', title: 'Error', message: 'Start date, start time, and day start time are required to lock the session.' });
      return;
    }

    const confirmed = await showModal({
      type: 'confirm',
      title: 'Lock Session Data',
      message: 'Are you sure you want to lock this session data? Once locked, the start date and day start time cannot be changed, and operators will begin logging data for this session.',
      confirmText: 'Lock Session',
    });

    if (confirmed) {
      try {
        await lockSession(session.id).unwrap();
        showModal({ type: 'alert', title: 'Success', message: 'Session data has been securely locked.' });
      } catch (err: any) {
        showModal({ type: 'alert', title: 'Error', message: err?.data?.message || 'Failed to lock session data.' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      <div className="bg-white border-b border-slate-200 p-6 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors w-fit"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={28} className="text-indigo-600" />
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Session Data</h1>
              {isLocked && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                  <Lock size={12} /> Locked
                </span>
              )}
            </div>
            <p className="text-slate-500 font-medium text-lg">
              Manage the operational season settings for {unit?.name || 'this unit'}.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {!isLocked && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-600" />
              <div className="text-sm font-medium">
                <strong className="font-bold">Notice:</strong> Operators cannot log daily data until this session is locked. Please configure and lock the start date and day start time to open the data entry portal.
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col gap-8">
              
              {/* Session Start Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-indigo-500" />
                    Session Start Configuration
                  </h3>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Start Date</label>
                  <input
                    type="date"
                    name="sessionStartDate"
                    value={formData.sessionStartDate}
                    onChange={handleChange}
                    disabled={isLocked}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800 transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Start Time</label>
                  <input
                    type="time"
                    name="sessionStartTime"
                    value={formData.sessionStartTime}
                    onChange={handleChange}
                    disabled={isLocked}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Day Boundary Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-indigo-500" />
                    Daily Operations Boundary
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">
                    This defines the time a new "Day" begins in the factory (e.g., 08:00 AM). It dictates when the upload window closes.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Day Start Time</label>
                  <input
                    type="time"
                    name="dayStartTime"
                    value={formData.dayStartTime}
                    onChange={handleChange}
                    disabled={isLocked}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Plant Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-indigo-500" />
                    Plant & Season Details
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">
                    Additional operational details for the daily log headers. These are also locked with the session.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plant Name</label>
                  <input
                    type="text"
                    name="plantName"
                    value={formData.plantName}
                    onChange={handleChange}
                    disabled={isLocked}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plant Code</label>
                  <input
                    type="text"
                    name="plantCode"
                    value={formData.plantCode}
                    onChange={handleChange}
                    disabled={isLocked}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Crushing Capacity</label>
                  <input
                    type="text"
                    name="crushingCapacity"
                    value={formData.crushingCapacity}
                    onChange={handleChange}
                    disabled={isLocked}
                    placeholder="e.g. 5000 TCD"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Crushing Season</label>
                  <input
                    type="text"
                    name="crushingSeason"
                    value={formData.crushingSeason}
                    onChange={handleChange}
                    disabled={isLocked}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Session Off Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-slate-400" />
                    Session Shutdown (Optional)
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">
                    Set this when the season is officially ending. Operators can only upload the final log up to this date. This can be edited even if the session is locked.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Off Date</label>
                  <input
                    type="date"
                    name="sessionOffDate"
                    value={formData.sessionOffDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Off Time</label>
                  <input
                    type="time"
                    name="sessionOffTime"
                    value={formData.sessionOffTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition-all"
                  />
                </div>
              </div>

            </div>
            
            <div className="p-6 bg-slate-50 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleLock}
                disabled={isLocked || isLocking || isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Lock size={18} />
                {isLocked ? 'Session Locked' : 'Lock Session Data'}
              </button>
              
              <button
                type="submit"
                disabled={isSaving || isLocking}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>

        </div>
      </div>
      <ModalComponent />
    </div>
  );
};
