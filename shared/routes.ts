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
    BASE: 'auth',
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
