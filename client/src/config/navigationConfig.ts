import { List, Settings, LayoutDashboard, UserPlus, Building, Network, FileText } from 'lucide-react';
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
    { to: PAGES.NEW_LOG, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: PAGES.DATA_ENTRY, icon: FileText, label: 'New Analysis', end: true },
    { to: PAGES.LOGS_LIST, icon: List, label: 'Logs', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
};
