import { getClientApiPath } from '../../../shared/routes';

export const PAGES = {
  LOGS_LIST: '/unit/dash/logs',
  DATA_ENTRY: '/unit/dash/entry',
  NEW_ANALYSIS: '/unit/dash/analysis/new',
  ANALYSIS_REPORT: '/unit/dash/analysis/:id',
  SETTINGS: '/settings',
  SUPER_ADMIN_INVITE: '/admin/dash/invite',
  LOGIN: '/login',
  SETUP_ORG: '/account/setup/org',
  SETUP_USER: '/account/setup/user',
  ADMIN_DASHBOARD: '/admin/dash',
  ADMIN_ORG_DETAILS: '/admin/dash/org/:id',
  ORG_DASHBOARD: '/org/dash',
  UNIT_DASHBOARD: '/unit/dash',
} as const;

export const getPagePath = {
  logsList: () => PAGES.LOGS_LIST,
  dataEntry: () => PAGES.DATA_ENTRY,
  newAnalysis: () => PAGES.NEW_ANALYSIS,
  analysisReport: (id: string | number) => `/unit/dash/analysis/${id}`,
  superAdminInvite: () => PAGES.SUPER_ADMIN_INVITE,
  login: () => PAGES.LOGIN,
  adminDashboard: () => PAGES.ADMIN_DASHBOARD,
  adminOrgDetails: (id: string | number) => `/admin/dash/org/${id}`,
};

export const API_ENDPOINTS = {
  // Auth API
  LOGIN: getClientApiPath.auth.login(),
  SETUP_ORG: getClientApiPath.auth.setupOrg(),
  SETUP_USER: getClientApiPath.auth.setupUser(),
  GET_TOKEN: getClientApiPath.auth.getToken,

  // Organizations API
  INVITE_ORGANIZATION: getClientApiPath.organizations.invite(),
  INVITE_USER: getClientApiPath.organizations.inviteUser,
  GET_ORGANIZATIONS: getClientApiPath.organizations.getAll(),
  GET_ORGANIZATION_BY_ID: getClientApiPath.organizations.getOne,

  // Units API
  CREATE_UNIT: getClientApiPath.units.create(),
  GET_UNIT_BY_ID: getClientApiPath.units.getOne,
  DAILY_LOGS: getClientApiPath.dailyLogs.base(),
  DAILY_LOG_BY_ID: (id: string | number) => getClientApiPath.dailyLogs.one(id),
  DOWNLOAD_DAILY_REPORT: getClientApiPath.reports.downloadTemplate(),
  SAVE_AND_GENERATE: getClientApiPath.reports.saveAndGenerate(),
} as const;
