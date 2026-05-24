import axios from 'axios';
import { API_ENDPOINTS } from '../config/routesConfig';
import { getClientApiPath } from '../../../shared/routes';
import { store } from '../store/store';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UpsertDailyLogPayload {
  logDate: string;
  metrics: Record<string, unknown>;
}

export interface DailyLogResponse {
  id: string;
  logDate: string;
  status: string;
  metrics: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function upsertDailyLog(
  data: UpsertDailyLogPayload,
): Promise<DailyLogResponse> {
  const { data: response } = await apiClient.post<DailyLogResponse>(
    API_ENDPOINTS.DAILY_LOGS,
    data,
  );
  return response;
}

export interface SaveAndGenerateResponse {
  id: string;
  fileBlob: Blob;
}

export async function saveAndGenerateReport(
  data: UpsertDailyLogPayload,
): Promise<SaveAndGenerateResponse> {
  const response = await apiClient.post<Blob>(
    API_ENDPOINTS.SAVE_AND_GENERATE,
    data,
    { responseType: 'blob' },
  );

  const contentDisposition = response.headers['content-disposition'] || '';
  const match = contentDisposition.match(/Daily_Report_([^.]+)\.xlsx/);
  const id = match ? match[1] : 'new';

  return {
    id,
    fileBlob: response.data,
  };
}

export async function getDailyLogs(): Promise<DailyLogResponse[]> {
  const { data: response } = await apiClient.get<DailyLogResponse[]>(
    API_ENDPOINTS.DAILY_LOGS,
  );
  return response;
}

export async function getDailyLogsByDate(date: string): Promise<DailyLogResponse[]> {
  const { data: response } = await apiClient.get<DailyLogResponse[]>(
    API_ENDPOINTS.DAILY_LOGS,
    { params: { date } }
  );
  return response;
}

export async function getDailyLogById(id: string): Promise<DailyLogResponse> {
  const { data: response } = await apiClient.get<DailyLogResponse>(
    API_ENDPOINTS.DAILY_LOG_BY_ID(id),
  );
  return response;
}

export function getDownloadDailyReportUrl(id?: string): string {
  const base = apiClient.defaults.baseURL || 'http://localhost:3000';
  if (id && id !== 'new') {
    return `${base}${getClientApiPath.reports.downloadOne(id)}`;
  }
  return `${base}${API_ENDPOINTS.DOWNLOAD_DAILY_REPORT}`;
}
