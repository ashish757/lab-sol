import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type RootState } from '../store';
import { API_ENDPOINTS } from '../../config/routesConfig';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    prepareHeaders: (hdrs, { getState }) => {
      const tok = (getState() as RootState).auth.token;
      if (tok) {
        hdrs.set('Authorization', `Bearer ${tok}`);
      }
      return hdrs;
    },
  }),
  tagTypes: ['Logs'],
  endpoints: (bld) => ({
    login: bld.mutation({
      query: (creds) => ({
        url: API_ENDPOINTS.LOGIN,
        method: 'POST',
        body: creds,
      }),
    }),
    inviteOrganization: bld.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.INVITE_ORGANIZATION,
        method: 'POST',
        body,
      }),
    }),
    upsertDailyLog: bld.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.DAILY_LOGS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Logs'],
    }),
    saveAndGenerateReport: bld.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.SAVE_AND_GENERATE,
        method: 'POST',
        body,
        responseHandler: (res) => res.blob(),
      }),
      transformResponse: (res: Blob, meta: any) => {
        const contentDisposition = meta?.response?.headers.get('content-disposition') || '';
        const match = contentDisposition.match(/Daily_Report_([^.]+)\.xlsx/);
        const id = match ? match[1] : 'new';
        return { id, fileBlob: res };
      },
    }),
    getDailyLogs: bld.query({
      query: () => API_ENDPOINTS.DAILY_LOGS,
      providesTags: ['Logs'],
    }),
    getDailyLogsByDate: bld.query({
      query: (date: string) => ({
        url: API_ENDPOINTS.DAILY_LOGS,
        params: { date },
      }),
      providesTags: ['Logs'],
    }),
    getDailyLogById: bld.query({
      query: (id: string) => API_ENDPOINTS.DAILY_LOG_BY_ID(id),
      providesTags: ['Logs'],
    }),
  }),
});

export const {
  useLoginMutation,
  useInviteOrganizationMutation,
  useUpsertDailyLogMutation,
  useSaveAndGenerateReportMutation,
  useGetDailyLogsQuery,
  useGetDailyLogsByDateQuery,
  useGetDailyLogByIdQuery,
} = apiSlice;
