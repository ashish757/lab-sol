import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

export type ModalType = 'alert' | 'confirm' | 'prompt';

export interface ModalOption {
  value: string;
  label: string;
}

export interface ModalConfig {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  inputType?: 'text' | 'select';
  inputLabel?: string;
  defaultValue?: string;
  options?: ModalOption[];
  confirmText?: string;
  cancelText?: string;
  onConfirm: (data?: any) => void;
  onCancel: () => void;
}

export const GenericModal: React.FC<{ config: ModalConfig | null }> = ({ config }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (config?.isOpen) {
      setInputValue(config.defaultValue || '');
    }
  }, [config]);

  if (!config || !config.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.type === 'prompt') {
      config.onConfirm(inputValue);
    } else {
      config.onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {config.type === 'alert' && <Info className="text-indigo-500" size={24} />}
            {config.title}
          </h2>
          <button onClick={config.onCancel} type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-slate-600 text-sm whitespace-pre-wrap">{config.message}</p>
          
          {config.type === 'prompt' && config.inputType === 'text' && (
            <div>
              {config.inputLabel && <label className="block text-sm font-medium text-slate-700 mb-1">{config.inputLabel}</label>}
              <input
                type="text"
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {config.type === 'prompt' && config.inputType === 'select' && (
            <div>
              {config.inputLabel && <label className="block text-sm font-medium text-slate-700 mb-1">{config.inputLabel}</label>}
              <select
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="" disabled>Select an option...</option>
                {config.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            {config.type !== 'alert' && (
              <button 
                type="button" 
                onClick={config.onCancel} 
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"
              >
                {config.cancelText || 'Cancel'}
              </button>
            )}
            <button 
              type="submit" 
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                config.type === 'confirm' && config.confirmText === 'Delete' 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {config.confirmText || 'OK'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
