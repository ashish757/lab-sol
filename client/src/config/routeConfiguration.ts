import { lazy } from 'react';
import { Role } from '../types/auth';
import { AnalysisPage } from '../pages/AnalysisPage';
import { PAGES } from './routesConfig';

const SuperAdminDash = lazy(() => import('../pages/dashboards/SuperAdminDash').then(m => ({ default: m.SuperAdminDash })));
const OrgDetailsPage = lazy(() => import('../pages/dashboards/OrgDetailsPage').then(m => ({ default: m.OrgDetailsPage })));
const OrgAdminDash = lazy(() => import('../pages/dashboards/OrgAdminDash').then(m => ({ default: m.OrgAdminDash })));
const UnitAdminDash = lazy(() => import('../pages/dashboards/UnitAdminDash').then(m => ({ default: m.UnitAdminDash })));
const UnitOpDash = lazy(() => import('../pages/dashboards/UnitOpDash').then(m => ({ default: m.UnitOpDash })));
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdminDashboard').then(m => ({ default: m.SuperAdminDashboard })));
const LogsPage = lazy(() => import('../pages/LogsPage').then(m => ({ default: m.LogsPage })));
const AnalysisReportPage = lazy(() => import('../pages/AnalysisReportPage').then(m => ({ default: m.AnalysisReportPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const allRoles = [Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.UNIT_ADMIN, Role.UNIT_OPERATOR];

export const routeConfiguration = [
  { path: PAGES.ADMIN_DASHBOARD, component: SuperAdminDash, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.ADMIN_ORG_DETAILS, component: OrgDetailsPage, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.SUPER_ADMIN_INVITE, component: SuperAdminDashboard, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.ORG_DASHBOARD, component: OrgAdminDash, allowedRoles: [Role.ORG_ADMIN] },
  { path: PAGES.UNIT_DASHBOARD, component: UnitAdminDash, allowedRoles: [Role.UNIT_ADMIN] },
  { path: PAGES.NEW_LOG, component: UnitOpDash, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.DATA_ENTRY, component: AnalysisPage, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.LOGS_LIST, component: LogsPage, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.NEW_ANALYSIS, component: AnalysisReportPage, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.ANALYSIS_REPORT, component: AnalysisReportPage, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.SETTINGS, component: SettingsPage, allowedRoles: allRoles },
];
