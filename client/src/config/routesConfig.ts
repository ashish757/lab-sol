import { getClientApiPath } from '../../../shared/routes';

export const PAGES = {
  HOME: '/',
  LOGS_LIST: '/logs',
  NEW_LOG: '/log/new',
  NEW_ANALYSIS: '/analysis/new',
  ANALYSIS_REPORT: '/analysis/:id',
  SETTINGS: '/settings',
  SUPER_ADMIN_INVITE: '/super-admin/invite',
} as const;

export const getPagePath = {
  home: () => PAGES.HOME,
  logsList: () => PAGES.LOGS_LIST,
  newLog: () => PAGES.NEW_LOG,
  newAnalysis: () => PAGES.NEW_ANALYSIS,
  analysisReport: (id: string | number) => `/analysis/${id}`,
  superAdminInvite: () => PAGES.SUPER_ADMIN_INVITE,
};

export const API_ENDPOINTS = {
  DAILY_LOGS: getClientApiPath.dailyLogs.base(),
  DAILY_LOG_BY_ID: (id: string | number) => getClientApiPath.dailyLogs.one(id),
  DOWNLOAD_DAILY_REPORT: getClientApiPath.reports.downloadTemplate(),
  SAVE_AND_GENERATE: getClientApiPath.reports.saveAndGenerate(),
  INVITE_ORGANIZATION: getClientApiPath.organizations.invite(),
} as const;
