import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDailyLogs,
  getDailyLogById,
  upsertDailyLog,
  type UpsertDailyLogPayload,
} from '../api/dailyLogs';

const QUERY_KEY = ['daily-logs'] as const;

export function useUpsertLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertDailyLogPayload) => upsertDailyLog(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },

    onError: (error: Error) => {
      alert(`Failed to save log: ${error.message}`);
    },
  });
}

export function useGetLogs() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDailyLogs,
    staleTime: 30_000, // re-fetch at most every 30 s
    retry: 1,
  });
}

export function useGetLogById(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => getDailyLogById(id!),
    enabled: !!id && id !== 'new',
    staleTime: 30_000,
    retry: 1,
  });
}
