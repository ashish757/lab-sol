import { getClientApiPath, clientRoutes } from '../../../shared/routes.config';

export const PAGES = {
  LOGS_LIST: clientRoutes.unit.logsList,
  DATA_ENTRY: clientRoutes.unit.dataEntry,
  NEW_ANALYSIS: clientRoutes.unit.dataEntry,
  ANALYSIS_REPORT: clientRoutes.unit.report,
  SETTINGS: clientRoutes.settings,
  SUPER_ADMIN_INVITE: clientRoutes.admin.invite,
  LOGIN: clientRoutes.auth.login,
  SETUP_ORG: clientRoutes.auth.setupAccount,
  SETUP_USER: clientRoutes.auth.setupUser,
  ADMIN_DASHBOARD: clientRoutes.admin.dashboard,
  ADMIN_ORG_DETAILS: clientRoutes.admin.orgDetails,
  ORG_DASHBOARD: clientRoutes.org.dashboard,
  UNIT_DASHBOARD: clientRoutes.unit.dashboard,
  STAFF_DASHBOARD: clientRoutes.staff.dashboard,
  STAFF_SETUP: clientRoutes.auth.staffSetup,
  PROFILE: clientRoutes.profile,
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
  UPDATE_USER: (id: string | number) => getClientApiPath.users.update(id),

  // Organizations API
  INVITE_ORGANIZATION: getClientApiPath.organizations.inviteOrg(),
  CANCEL_ORG_INVITE: (id: string | number) => getClientApiPath.organizations.cancelInvite(id),
  GET_ORGANIZATIONS: getClientApiPath.organizations.getAll(),
  GET_ORGANIZATION_BY_ID: getClientApiPath.organizations.getOne,

  // Units API
  CREATE_UNIT: getClientApiPath.units.create(),
  GET_UNIT_BY_ID: getClientApiPath.units.getOne,
  UPDATE_UNIT: (id: string | number) => getClientApiPath.units.update(id),
  DELETE_UNIT: (id: string | number) => getClientApiPath.units.delete(id),
  DAILY_LOGS: getClientApiPath.dailyLogs.base(),
  FETCH_UNIT_LOGS: (unitId: string) => `/api/daily-logs/unit/${unitId}`,
  UPSERT_UNIT_LOG: (unitId: string) => `/api/daily-logs/unit/${unitId}/upsert`,
  LOCK_UNIT_LOG: (logId: string) => `/api/daily-logs/${logId}/lock`,
  DAILY_LOG_BY_ID: (id: string | number) => getClientApiPath.dailyLogs.one(id),
  DOWNLOAD_DAILY_REPORT: getClientApiPath.reports.downloadTemplate(),
  SAVE_AND_GENERATE: getClientApiPath.reports.saveAndGenerate(),
} as const;
