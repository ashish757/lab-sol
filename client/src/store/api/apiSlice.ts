import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type RootState } from '../store';
import { API_ENDPOINTS } from '../../config/routesConfig';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    /**
     * Replaces the legacy Axios interceptor requirement.
     * Automatically extracts the JWT authentication token from the Redux RootState
     * and strictly injects it into the Authorization header for all outgoing API requests.
     */
    prepareHeaders: (headers, { getState }) => {
      const authenticationToken = (getState() as RootState).auth.token;
      if (authenticationToken) {
        headers.set('Authorization', `Bearer ${authenticationToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Logs', 'Organizations'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginCredentials) => ({
        url: API_ENDPOINTS.LOGIN,
        method: 'POST',
        body: loginCredentials,
      }),
    }),
    inviteOrganization: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.INVITE_ORGANIZATION,
        method: 'POST',
        body,
      }),
    }),
    getOrganizations: builder.query({
      query: () => API_ENDPOINTS.GET_ORGANIZATIONS,
      providesTags: ['Organizations'] as const,
    }),
    getOrganizationById: builder.query({
      query: (id: string) => API_ENDPOINTS.GET_ORGANIZATION_BY_ID(id),
      providesTags: ['Organizations'] as const,
    }),
    upsertDailyLog: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.DAILY_LOGS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Logs'],
    }),
    saveAndGenerateReport: builder.mutation({
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
    getDailyLogs: builder.query({
      query: () => API_ENDPOINTS.DAILY_LOGS,
      providesTags: ['Logs'],
    }),
    getDailyLogsByDate: builder.query({
      query: (date: string) => ({
        url: API_ENDPOINTS.DAILY_LOGS,
        params: { date },
      }),
      providesTags: ['Logs'],
    }),
    getDailyLogById: builder.query({
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
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
} = apiSlice;
