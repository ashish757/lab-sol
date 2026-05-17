import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

export interface UpsertDailyLogPayload {
  logDate: string;
  metrics: Record<string, unknown>;
}

export interface DailyLogResponse {
  id: string | number;
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
    '/api/daily-logs',
    data,
  );
  return response;
}

export async function getDailyLogs(): Promise<DailyLogResponse[]> {
  const { data: response } = await apiClient.get<DailyLogResponse[]>(
    '/api/daily-logs',
  );
  return response;
}
