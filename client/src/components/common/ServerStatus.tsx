import { useState, useEffect } from 'react';
import { getClientApiPath } from '../../../../shared/routes.config';

export const ServerStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}${getClientApiPath.health()}`);
        if (res.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (err) {
        setStatus('offline');
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold shadow-sm w-fit mx-auto mb-6">
      <span className="text-slate-500">Server Status:</span>
      {status === 'checking' && (
        <span className="flex items-center gap-1.5 text-amber-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Waking up...
        </span>
      )}
      {status === 'online' && (
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Online
        </span>
      )}
      {status === 'offline' && (
        <span className="flex items-center gap-1.5 text-red-600">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Offline
        </span>
      )}
    </div>
  );
};
