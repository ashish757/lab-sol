import { List, Settings, LayoutDashboard, Building, FileText } from 'lucide-react';
import { PAGES } from './routesConfig';
import { Role } from '../types/auth';

export const navigationConfig = {
  [Role.SUPER_ADMIN]: [
    { to: PAGES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: PAGES.SUPER_ADMIN_INVITE, icon: Building, label: 'Invite Organization', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
  [Role.ORG_ADMIN]: [
    { to: PAGES.ORG_DASHBOARD, icon: Building, label: 'Organization', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
  [Role.ORG_STAFF]: [
    { to: PAGES.STAFF_DASHBOARD, icon: Building, label: 'Organization', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
  [Role.UNIT_OPERATOR]: [
    { to: PAGES.UNIT_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: PAGES.DATA_ENTRY, icon: FileText, label: 'New Analysis', end: true },
    { to: PAGES.LOGS_LIST, icon: List, label: 'Logs', end: true },
    { to: PAGES.SETTINGS, icon: Settings, label: 'Settings', end: false },
  ],
};
