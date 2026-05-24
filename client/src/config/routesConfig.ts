import { getClientApiPath } from '../../../shared/routes';

export const PAGES = {
  LOGS_LIST: '/operator/dash/logs',
  NEW_LOG: '/operator/dash',
  DATA_ENTRY: '/operator/dash/entry',
  NEW_ANALYSIS: '/operator/dash/analysis/new',
  ANALYSIS_REPORT: '/operator/dash/analysis/:id',
  SETTINGS: '/settings',
  SUPER_ADMIN_INVITE: '/admin/dash/invite',
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dash',
  ADMIN_ORG_DETAILS: '/admin/dash/org/:id',
  ORG_DASHBOARD: '/org/dash',
  UNIT_DASHBOARD: '/unit/dash',
} as const;

export const getPagePath = {
  logsList: () => PAGES.LOGS_LIST,
  newLog: () => PAGES.NEW_LOG,
  dataEntry: () => PAGES.DATA_ENTRY,
  newAnalysis: () => PAGES.NEW_ANALYSIS,
  analysisReport: (id: string | number) => `/operator/dash/analysis/${id}`,
  superAdminInvite: () => PAGES.SUPER_ADMIN_INVITE,
  login: () => PAGES.LOGIN,
  adminDashboard: () => PAGES.ADMIN_DASHBOARD,
  adminOrgDetails: (id: string | number) => `/admin/dash/org/${id}`,
};

export const API_ENDPOINTS = {
  LOGIN: getClientApiPath.auth.login(),
  INVITE_ORGANIZATION: getClientApiPath.organizations.invite(),
  GET_ORGANIZATIONS: getClientApiPath.organizations.getAll(),
  GET_ORGANIZATION_BY_ID: (id: string | number) => getClientApiPath.organizations.getOne(id),
  GET_UNIT_BY_ID: (id: string | number) => getClientApiPath.units.getOne(id),
  DAILY_LOGS: getClientApiPath.dailyLogs.base(),
  DAILY_LOG_BY_ID: (id: string | number) => getClientApiPath.dailyLogs.one(id),
  DOWNLOAD_DAILY_REPORT: getClientApiPath.reports.downloadTemplate(),
  SAVE_AND_GENERATE: getClientApiPath.reports.saveAndGenerate(),
} as const;
