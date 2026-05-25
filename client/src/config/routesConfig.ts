import { getClientApiPath, clientRoutes } from '../../../shared/routes.config';

export const PAGES = {
  LOGS_LIST: clientRoutes.analysis.logsList,
  DATA_ENTRY: clientRoutes.analysis.dataEntry,
  NEW_ANALYSIS: clientRoutes.analysis.dataEntry,
  ANALYSIS_REPORT: clientRoutes.analysis.report,
  SETTINGS: clientRoutes.settings,
  SUPER_ADMIN_INVITE: clientRoutes.admin.invite,
  LOGIN: clientRoutes.auth.login,
  SETUP_ORG: clientRoutes.auth.setupAccount,
  SETUP_USER: clientRoutes.auth.setupUser,
  ADMIN_DASHBOARD: clientRoutes.admin.dashboard,
  ADMIN_ORG_DETAILS: clientRoutes.admin.orgDetails,
  ORG_DASHBOARD: clientRoutes.org.dashboard,
  UNIT_DASHBOARD: clientRoutes.unit.dashboard,
  STAFF_SETUP: clientRoutes.auth.staffSetup,
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
  SETUP_ORG: getClientApiPath.auth.setupAccount(),
  SETUP_USER: getClientApiPath.auth.setupUser(),
  INVITE_PREVIEW: getClientApiPath.auth.invitePreview,
  ACTIVATE_STAFF: getClientApiPath.auth.activateStaff(),

  // Users API
  INVITE_USER: getClientApiPath.users.invite(),
  CANCEL_USER_INVITE: (tokenId: string) => getClientApiPath.users.cancelInvite(tokenId),

  // Organizations API
  INVITE_ORGANIZATION: getClientApiPath.organizations.inviteOrg(),
  CANCEL_ORG_INVITE: (id: string | number) => getClientApiPath.organizations.cancelInvite(id),
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
