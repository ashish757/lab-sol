import { NavLink, Outlet } from 'react-router-dom';
import { Home, FileText, List, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/analysis/new', icon: FileText, label: 'New Analysis' },
  { to: '/logs', icon: List, label: 'Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const AppLayout = () => {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50">
      <nav className="w-16 md:w-20 bg-slate-900 border-r border-slate-800 flex flex-col py-6 items-center z-50 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.75} />
              <span className="absolute left-full ml-3 px-2 py-1 text-xs font-medium text-white bg-slate-700 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                {label}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-slate-300 text-xs font-bold cursor-pointer hover:border-blue-500 transition-colors">
          A
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
