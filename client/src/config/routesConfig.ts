import { getClientApiPath, clientRoutes } from '../../../shared/routes.config';

export const PAGES = {
  LOGS_LIST: clientRoutes.unit.logsList,
  NEW_LOG_DATA: clientRoutes.unit.dataEntry,
  LOG_DATA_REPORT: clientRoutes.unit.report,
  SETTINGS: clientRoutes.settings,
  SUPER_ADMIN_INVITE: clientRoutes.admin.invite,
  LOGIN: clientRoutes.auth.login,
  SETUP_ORG: clientRoutes.auth.setupAccount,
  SETUP_USER: clientRoutes.auth.setupUser,
  ADMIN_DASHBOARD: clientRoutes.admin.dashboard,
  ADMIN_ORG_DETAILS: clientRoutes.admin.orgDetails,
  ORG_DASHBOARD: clientRoutes.org.dashboard,
  ORG_UNIT_DETAILS: clientRoutes.org.unitDetails,
  UNIT_DASHBOARD: clientRoutes.unit.dashboard,
  STAFF_DASHBOARD: clientRoutes.staff.dashboard,
  STAFF_SETUP: clientRoutes.auth.staffSetup,
  PROFILE: clientRoutes.profile,
  ORG_UNIT_SETTINGS: clientRoutes.org.unitSettings,
  UNIT_SETTINGS: clientRoutes.unit.settings,
  CUSTOM_REPORT: clientRoutes.unit.customReport,
} as const;

export const getPagePath = {
  logsList: () => PAGES.LOGS_LIST,
  newLogData: () => PAGES.NEW_LOG_DATA,
  logDataReport: (id: string | number) => PAGES.LOG_DATA_REPORT.replace(':id', String(id)),
  superAdminInvite: () => PAGES.SUPER_ADMIN_INVITE,
  login: () => PAGES.LOGIN,
  adminDashboard: () => PAGES.ADMIN_DASHBOARD,
  adminOrgDetails: (id: string | number) => `/admin/dash/org/${id}`,
  orgUnitDetails: (id: string | number) => `/org/dash/unit/${id}`,
  customReport: () => PAGES.CUSTOM_REPORT,
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
  FETCH_UNIT_LOGS: getClientApiPath.dailyLogs.unitLogs,
  UPSERT_UNIT_LOG: getClientApiPath.dailyLogs.upsert,
  LOCK_UNIT_LOG: getClientApiPath.dailyLogs.lock,
  UNLOCK_UNIT_LOG: getClientApiPath.dailyLogs.unlock,
  DAILY_LOG_BY_ID: (id: string | number) => getClientApiPath.dailyLogs.one(id),
  DOWNLOAD_DAILY_REPORT: getClientApiPath.reports.downloadTemplate(),
  SAVE_AND_GENERATE: getClientApiPath.reports.saveAndGenerate(),
  GENERATE_CALCULATED_REPORT: (id: string | number) => getClientApiPath.reports.calculatedExcel(id),

  // Sessions API
  GET_ACTIVE_SESSION: (unitId: string) => getClientApiPath.sessions.getActive(unitId),
  UPSERT_SESSION: getClientApiPath.sessions.upsert(),
  LOCK_SESSION: (id: string) => getClientApiPath.sessions.lock(id),
} as const;
