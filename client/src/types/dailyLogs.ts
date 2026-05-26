export interface DailyLogResponse {
  id: string;
  createdAt: string;
  metrics: Record<string, unknown>;
  updatedAt: string;
  lockedAt: string | null;
  createdBy: string;
  status: string;
}
