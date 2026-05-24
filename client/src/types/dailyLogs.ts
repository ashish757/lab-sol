export interface DailyLogResponse {
  id: string;
  logDate: string;
  metrics: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: string;
}
