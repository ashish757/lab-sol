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
  tagTypes: ['Logs', 'Organizations', 'Units'],
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
      invalidatesTags: ['Organizations'],
    }),
    cancelOrganizationInvite: builder.mutation({
      query: (id: string) => ({
        url: API_ENDPOINTS.CANCEL_ORG_INVITE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Organizations'],
    }),
    inviteUser: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.INVITE_USER,
        method: 'POST',
        body,
      }),
    }),
    cancelUserInvite: builder.mutation({
      query: (tokenId: string) => ({
        url: API_ENDPOINTS.CANCEL_USER_INVITE(tokenId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Organizations'],
    }),
    createUnit: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.CREATE_UNIT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Units', 'Organizations'],
    }),
    setupAccount: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.SETUP_ORG,
        method: 'POST',
        body,
      }),
    }),
    setupUser: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.SETUP_USER,
        method: 'POST',
        body,
      }),
    }),
    activateStaff: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.ACTIVATE_STAFF,
        method: 'POST',
        body,
      }),
    }),
    invitePreview: builder.query({
      query: (token: string) => API_ENDPOINTS.INVITE_PREVIEW(token),
    }),
    getOrganizations: builder.query({
      query: () => API_ENDPOINTS.GET_ORGANIZATIONS,
      providesTags: ['Organizations'] as const,
    }),
    getOrganizationById: builder.query({
      query: (id: string) => API_ENDPOINTS.GET_ORGANIZATION_BY_ID(id),
      providesTags: ['Organizations'] as const,
    }),
    getUnitById: builder.query({
      query: (id: string) => API_ENDPOINTS.GET_UNIT_BY_ID(id),
      providesTags: ['Units'] as const,
    }),
    upsertDailyLog: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.DAILY_LOGS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Logs'],
    }),
    fetchUnitLogs: builder.query({
      query: (unitId: string) => API_ENDPOINTS.FETCH_UNIT_LOGS(unitId),
      providesTags: ['Logs'],
    }),
    upsertUnitLog: builder.mutation({
      query: ({ unitId, data }) => ({
        url: API_ENDPOINTS.UPSERT_UNIT_LOG(unitId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Logs'],
    }),
    lockUnitLog: builder.mutation({
      query: (logId: string) => ({
        url: API_ENDPOINTS.LOCK_UNIT_LOG(logId),
        method: 'PATCH',
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
  useCancelOrganizationInviteMutation,
  useUpsertDailyLogMutation,
  useFetchUnitLogsQuery,
  useUpsertUnitLogMutation,
  useLockUnitLogMutation,
  useSaveAndGenerateReportMutation,
  useGetDailyLogsQuery,
  useGetDailyLogsByDateQuery,
  useGetDailyLogByIdQuery,
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useGetUnitByIdQuery,
  useInviteUserMutation,
  useCancelUserInviteMutation,
  useCreateUnitMutation,
  useSetupAccountMutation,
  useSetupUserMutation,
  useActivateStaffMutation,
  useInvitePreviewQuery,
} = apiSlice;
