import axios from 'axios';
import { API_ENDPOINTS } from '../config/routesConfig';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
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

export async function getDailyLogs(): Promise<DailyLogResponse[]> {
  const { data: response } = await apiClient.get<DailyLogResponse[]>(
    API_ENDPOINTS.DAILY_LOGS,
  );
  return response;
}

export async function getDailyLogById(id: string): Promise<DailyLogResponse> {
  const { data: response } = await apiClient.get<DailyLogResponse>(
    API_ENDPOINTS.DAILY_LOG_BY_ID(id),
  );
  return response;
}
