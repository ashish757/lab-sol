/**
 * Shared API route definitions for NestJS backend and React frontend.
 * 
 * - Backend (NestJS): Uses the raw segments for decorators.
 * - Frontend (Client): Uses the functions/absolute path helpers to call endpoints.
 */

export const API_ROUTES = {
  HEALTH: {
    BASE: 'health',
  },
  AUTH: {
    BASE: 'api/auth',
    LOGIN: 'login',
    SETUP_ORG: 'setup-org',
    SETUP_USER: 'setup-user',
    GET_TOKEN: 'setup-token/:token',
  },
  ORGANIZATIONS: {
    BASE: 'api/organizations',
    INVITE: 'invite',
    INVITE_USER: ':id/invite-user',
    GET_ALL: '',
    GET_ONE: ':id',
  },
  UNITS: {
    BASE: 'api/units',
    CREATE: '',
    GET_ONE: ':id',
  },
  DAILY_LOGS: {
    BASE: 'api/daily-logs',
    CREATE: '',
    GET_ALL: '',
    GET_ONE: ':id',
  },
  REPORTS: {
    BASE: 'api/reports',
    DOWNLOAD_TEMPLATE: 'daily-logs/download',
    DOWNLOAD_ONE: 'daily-logs/download/:id',
    SAVE_AND_GENERATE: 'save-and-generate',
  },
} as const;

// Absolute path generators for client consumption
export const getClientApiPath = {
  health: () => `/${API_ROUTES.HEALTH.BASE}`,
  auth: {
    login: () => `/${API_ROUTES.AUTH.BASE}/${API_ROUTES.AUTH.LOGIN}`,
    setupOrg: () => `/${API_ROUTES.AUTH.BASE}/${API_ROUTES.AUTH.SETUP_ORG}`,
    setupUser: () => `/${API_ROUTES.AUTH.BASE}/${API_ROUTES.AUTH.SETUP_USER}`,
    getToken: (token: string) => `/${API_ROUTES.AUTH.BASE}/setup-token/${token}`,
  },
  organizations: {
    invite: () => `/${API_ROUTES.ORGANIZATIONS.BASE}/${API_ROUTES.ORGANIZATIONS.INVITE}`,
    inviteUser: (id: string | number) => `/${API_ROUTES.ORGANIZATIONS.BASE}/${id}/invite-user`,
    getAll: () => `/${API_ROUTES.ORGANIZATIONS.BASE}`,
    getOne: (id: string | number) => `/${API_ROUTES.ORGANIZATIONS.BASE}/${id}`,
  },
  units: {
    create: () => `/${API_ROUTES.UNITS.BASE}`,
    getOne: (id: string | number) => `/${API_ROUTES.UNITS.BASE}/${id}`,
  },
  dailyLogs: {
    base: () => `/${API_ROUTES.DAILY_LOGS.BASE}`,
    one: (id: string | number) => `/${API_ROUTES.DAILY_LOGS.BASE}/${id}`,
  },
  reports: {
    downloadTemplate: () => `/${API_ROUTES.REPORTS.BASE}/${API_ROUTES.REPORTS.DOWNLOAD_TEMPLATE}`,
    downloadOne: (id: string | number) => `/${API_ROUTES.REPORTS.BASE}/daily-logs/download/${id}`,
    saveAndGenerate: () => `/${API_ROUTES.REPORTS.BASE}/save-and-generate`,
  },
};
