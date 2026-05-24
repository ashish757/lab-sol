import { Home, FileText, List, Settings, LayoutDashboard, UserPlus, Building, Network } from 'lucide-react';
import { PAGES } from './routesConfig';
import { Role } from '../types/auth';

export const navigationConfig = {
  [Role.SUPER_ADMIN]: [
    { to: PAGES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: PAGES.SUPER_ADMIN_INVITE, icon: UserPlus, label: 'Invite Admin', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
  [Role.ORG_ADMIN]: [
    { to: PAGES.ORG_DASHBOARD, icon: Building, label: 'Organization', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
  [Role.UNIT_ADMIN]: [
    { to: PAGES.UNIT_DASHBOARD, icon: Network, label: 'Unit Management', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
  [Role.UNIT_OPERATOR]: [
    { to: PAGES.HOME, icon: Home, label: 'Analytics', end: true },
    { to: PAGES.NEW_LOG, icon: FileText, label: 'New Analysis', end: false },
    { to: PAGES.LOGS_LIST, icon: List, label: 'Logs', end: false },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
};
