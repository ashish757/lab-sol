import { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';

interface SeasonSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  onSave: (unitId: string, startDate: string, endDate?: string) => Promise<void>;
}

export const SeasonSettingsModal = ({ isOpen, onClose, unit, onSave }: SeasonSettingsModalProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStartLocked = !!unit?.seasonStartDate;
  const isEndLocked = !!unit?.seasonEndDate;

  useEffect(() => {
    if (isOpen && unit) {
      setStartDate(unit.seasonStartDate || '');
      setEndDate(unit.seasonEndDate || '');
      setShowConfirm(false);
      setError(null);
    }
  }, [isOpen, unit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      setError('Season Start Date is required.');
      return;
    }

    if (endDate && endDate < startDate) {
      setError('Season End Date cannot be before the Start Date.');
      return;
    }

    // If either date wasn't previously locked and is being set now, require confirmation
    const settingNewStart = !isStartLocked && startDate;
    const settingNewEnd = !isEndLocked && endDate;

    if ((settingNewStart || settingNewEnd) && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(unit.id, startDate, endDate || undefined);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save season settings.');
      // If the save failed, revert confirmation state so they can try again if needed
      setShowConfirm(false); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600" />
            Season Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-2">
            <h3 className="font-bold text-indigo-900 text-sm mb-1">{unit?.name}</h3>
            <p className="text-xs text-indigo-700">Configure the active season dates for this factory unit. Data can only be logged within these dates.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {showConfirm ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-2">
              <div className="flex items-center gap-3 text-amber-700 font-bold mb-3">
                <AlertTriangle size={24} />
                <h4 className="text-lg">Are you sure?</h4>
              </div>
              <p className="text-sm text-amber-800 mb-4 leading-relaxed">
                {!isStartLocked && startDate && (
                  <>You are setting the Season Start Date to <strong>{startDate}</strong>.<br/></>
                )}
                {!isEndLocked && endDate && (
                  <>You are setting the Season End Date to <strong>{endDate}</strong>.<br/></>
                )}
                <br />
                Once confirmed, these dates <strong>cannot be changed</strong>. This enforces strict chronological logging for the operators.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white border border-amber-200 text-amber-800 font-bold rounded-xl text-sm transition-colors hover:bg-amber-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Yes, Confirm'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Season Start Date
                  {isStartLocked && <span className="ml-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider px-2 py-0.5 bg-indigo-100 rounded">Locked</span>}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isStartLocked}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
                {!isStartLocked && <p className="text-xs text-amber-600 mt-1.5 font-medium flex items-center gap-1"><AlertTriangle size={12}/> Cannot be edited after saving.</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Season End Date <span className="text-slate-400 font-normal">(Optional)</span>
                  {isEndLocked && <span className="ml-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider px-2 py-0.5 bg-indigo-100 rounded">Locked</span>}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isEndLocked}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1">
                  {!isEndLocked && endDate ? <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={12}/> Cannot be edited after saving.</span> : 'Operators will not be able to log data past this date.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isStartLocked && isEndLocked}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStartLocked && isEndLocked ? 'Dates Locked' : 'Save Season Settings'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
