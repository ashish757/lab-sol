import { getClientApiPath } from '../../../shared/routes';

export const PAGES = {
  HOME: '/operator/dash/home',
  LOGS_LIST: '/operator/dash/logs',
  NEW_LOG: '/operator/dash',
  NEW_ANALYSIS: '/operator/dash/analysis/new',
  ANALYSIS_REPORT: '/operator/dash/analysis/:id',
  SETTINGS: '/settings',
  SUPER_ADMIN_INVITE: '/admin/dash/invite',
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dash',
  ORG_DASHBOARD: '/org/dash',
  UNIT_DASHBOARD: '/unit/dash',
} as const;

export const getPagePath = {
  home: () => PAGES.HOME,
  logsList: () => PAGES.LOGS_LIST,
  newLog: () => PAGES.NEW_LOG,
  newAnalysis: () => PAGES.NEW_ANALYSIS,
  analysisReport: (id: string | number) => `/operator/dash/analysis/${id}`,
  superAdminInvite: () => PAGES.SUPER_ADMIN_INVITE,
  login: () => PAGES.LOGIN,
  adminDashboard: () => PAGES.ADMIN_DASHBOARD,
};

export const API_ENDPOINTS = {
  DAILY_LOGS: getClientApiPath.dailyLogs.base(),
  DAILY_LOG_BY_ID: (id: string | number) => getClientApiPath.dailyLogs.one(id),
  DOWNLOAD_DAILY_REPORT: getClientApiPath.reports.downloadTemplate(),
  SAVE_AND_GENERATE: getClientApiPath.reports.saveAndGenerate(),
  INVITE_ORGANIZATION: getClientApiPath.organizations.invite(),
  LOGIN: getClientApiPath.auth.login(),
} as const;
