import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Suspense } from 'react';
import type { RootState } from '../../store/store';
import { navigationConfig } from '../../config/navigationConfig';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { Role } from '../../types/auth';

export const AppLayout = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const userRole = authState.user?.role as Role;

  const dynamicNavItems = userRole && navigationConfig[userRole] ? navigationConfig[userRole] : [];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50">
      <nav className="w-16 bg-slate-950 border-r border-slate-900 flex flex-col pb-6 pt-5 items-center z-50 shrink-0">

        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center mb-5 shrink-0 hover:scale-105 transition-transform duration-200 cursor-pointer">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <div className="flex flex-col items-end gap-2 flex-1 w-full pl-2">
          {dynamicNavItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `group relative w-11 h-11 rounded-lg rounded-r-none  flex items-center justify-center transition-all duration-200  w-full ${isActive
                  ? 'bg-slate-100 scale-105'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 hover:scale-105'
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />

              <span className="absolute left-full ml-3 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 border border-slate-800 rounded-lg whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 pointer-events-none shadow-xl z-50">
                {label}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-900 text-xs font-bold cursor-pointer hover:bg-slate-800 hover:text-white hover:scale-105 transition-all shadow-md shadow-black/20">
          U
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden bg-slate-50 relative">
        <Suspense fallback={<LoadingIndicator />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
