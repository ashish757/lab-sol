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
    <div className="h-screen w-full flex overflow-hidden bg-slate-100">
      <nav className="w-14 bg-slate-800 border-r border-slate-700/60 flex flex-col py-5 items-center z-50 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center mb-8 shrink-0">
          <svg className="w-4 h-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                  isActive
                    ? 'bg-slate-600 text-slate-100'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/60'
                }`
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              <span className="absolute left-full ml-2.5 px-2 py-1 text-xs font-medium text-slate-200 bg-slate-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-md">
                {label}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 text-xs font-semibold cursor-pointer hover:bg-slate-500 transition-colors">
          A
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
