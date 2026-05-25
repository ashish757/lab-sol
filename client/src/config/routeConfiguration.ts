import { lazy } from 'react';
import { Role } from '../types/auth';
import { PAGES } from './routesConfig';

const SuperAdminDash = lazy(() => import('../pages/superAdmin/SuperAdminDash').then(m => ({ default: m.SuperAdminDash })));
const SuperAdminOrgDetailsPage = lazy(() => import('../pages/superAdmin/OrgDetailsPage').then(m => ({ default: m.SuperAdminOrgDetailsPage })));
const SuperAdminOrgInvitation = lazy(() => import('../pages/superAdmin/OrgInvitation').then(m => ({ default: m.SuperAdminOrgInvitation })));

const OrgAdminDash = lazy(() => import('../pages/orgAdmin/OrgAdminDash').then(m => ({ default: m.OrgAdminDash })));
const OrgStaffDash = lazy(() => import('../pages/orgStaff/OrgStaffDash').then(m => ({ default: m.OrgStaffDash })));

const UnitOpDash = lazy(() => import('../pages/unitOperator/UnitOperatorDash').then(m => ({ default: m.UnitOpDash })));
const LogsPage = lazy(() => import('../pages/unitOperator/LogsPage').then(m => ({ default: m.LogsPage })));
const AnalysisPage = lazy(() => import('../pages/unitOperator/AnalysisPage').then(m => ({ default: m.AnalysisPage })));
const AnalysisReportPage = lazy(() => import('../pages/unitOperator/AnalysisPage').then(m => ({ default: m.AnalysisPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const allRoles = [Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.ORG_STAFF, Role.UNIT_OPERATOR];

export const routeConfiguration = [
  { path: PAGES.ADMIN_DASHBOARD, component: SuperAdminDash, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.ADMIN_ORG_DETAILS, component: SuperAdminOrgDetailsPage, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.SUPER_ADMIN_INVITE, component: SuperAdminOrgInvitation, allowedRoles: [Role.SUPER_ADMIN] },
  { path: PAGES.ORG_DASHBOARD, component: OrgAdminDash, allowedRoles: [Role.ORG_ADMIN] },
  { path: PAGES.STAFF_DASHBOARD, component: OrgStaffDash, allowedRoles: [Role.ORG_STAFF] },
  { path: PAGES.UNIT_DASHBOARD, component: UnitOpDash, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.DATA_ENTRY, component: AnalysisPage, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.LOGS_LIST, component: LogsPage, allowedRoles: [Role.UNIT_OPERATOR, Role.ORG_ADMIN, Role.ORG_STAFF] },
  { path: PAGES.NEW_ANALYSIS, component: AnalysisReportPage, allowedRoles: [Role.UNIT_OPERATOR] },
  { path: PAGES.ANALYSIS_REPORT, component: AnalysisReportPage, allowedRoles: [Role.UNIT_OPERATOR, Role.ORG_ADMIN, Role.ORG_STAFF] },
  { path: PAGES.SETTINGS, component: SettingsPage, allowedRoles: allRoles },
];
