import { SuperAdminDash } from '../pages/dashboards/SuperAdminDash';
import { OrgAdminDash } from '../pages/dashboards/OrgAdminDash';
import { UnitAdminDash } from '../pages/dashboards/UnitAdminDash';
import { UnitOpDash } from '../pages/dashboards/UnitOpDash';
import { SuperAdminDashboard } from '../pages/SuperAdminDashboard';
import { HomePage } from '../pages/HomePage';
import { LogsPage } from '../pages/LogsPage';
import { AnalysisReportPage } from '../pages/AnalysisReportPage';
import { SettingsPage } from '../pages/SettingsPage';
import { Role } from '../types/auth';
import { PAGES } from './routesConfig';

const allRoles = [Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.UNIT_ADMIN, Role.UNIT_OPERATOR];

export const routeConfiguration = [
  { path: PAGES.ADMIN_DASHBOARD, component: SuperAdminDash, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.SUPER_ADMIN_INVITE, component: SuperAdminDashboard, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.ORG_DASHBOARD, component: OrgAdminDash, allowedRoles: [Role.SUPER_ADMIN, Role.ORG_ADMIN] },
  { path: PAGES.UNIT_DASHBOARD, component: UnitAdminDash, allowedRoles: [Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.UNIT_ADMIN] },
  { path: PAGES.NEW_LOG, component: UnitOpDash, allowedRoles: allRoles },
  { path: PAGES.HOME, component: HomePage, allowedRoles: allRoles },
  { path: PAGES.LOGS_LIST, component: LogsPage, allowedRoles: allRoles },
  { path: PAGES.NEW_ANALYSIS, component: AnalysisReportPage, allowedRoles: allRoles },
  { path: PAGES.ANALYSIS_REPORT, component: AnalysisReportPage, allowedRoles: allRoles },
  { path: PAGES.SETTINGS, component: SettingsPage, allowedRoles: allRoles },
];
