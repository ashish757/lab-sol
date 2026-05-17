# Context
We are connecting our React (Vite) frontend to our NestJS backend. The application manages a 138-field daily production log for a factory. 
- Frontend Stack: React, Tailwind CSS, React Hook Form, TanStack Query (`@tanstack/react-query`), Axios, React Router.
- Backend API: Available at `http://localhost:3000/api/daily-logs`. 
- Payload Structure: The backend expects `{ logDate: string, metrics: Record<string, any> }`.

# Task
Generate the frontend services, hooks, and UI components needed to:
1. Submit the `AnalysisForm` data to the backend (Upsert).
2. Fetch and display past logs on a new `LogsPage`.

# Detailed Implementation Steps

### 1. API Setup & Types (`src/api/dailyLogs.ts`)
- Create an Axios instance/service pointing to the `/api/daily-logs` endpoint.
- Define the TypeScript interfaces for the API request (`UpsertDailyLogPayload`) and response (`DailyLogResponse`).
- Create two asynchronous API functions: `upsertDailyLog(data)` and `getDailyLogs()`.

### 2. TanStack Query Hooks (`src/hooks/useDailyLogs.ts`)
- Create a `useUpsertLog` hook using `useMutation`. On success, it should invalidate the 'daily-logs' query to refresh the list and show a success toast/alert.
- Create a `useGetLogs` hook using `useQuery` with the query key `['daily-logs']` to fetch historical logs.

### 3. Connect to the Form (`src/components/AnalysisForm.tsx`)
- Import the `useUpsertLog` mutation into the existing `AnalysisForm`.
- Update the `react-hook-form` `onSubmit` handler:
  - Extract `todayDate` from the form data to use as the `logDate`.
  - Pass the entire form data object as the `metrics` property.
  - Call the mutation.
- Disable the submit button and change its text to "Saving..." when `mutation.isPending` is true.

### 4. Create the Logs Dashboard (`src/pages/LogsPage.tsx`)
- Create a new page component that uses the `useGetLogs` hook.
- Handle `isLoading` and `isError` states gracefully with Tailwind-styled skeletons or error messages.
- Display the fetched logs in a clean Tailwind CSS table.
- The table columns should include: Date (`logDate`), Status (`status`), and a few key metrics extracted from the JSON (e.g., `metrics.caneCrushed`, `metrics.totalSugarBagged`).
- Format the dates nicely (e.g., using `Intl.DateTimeFormat` or `date-fns`).

# Expected Output
Provide the code for:
1. `src/api/dailyLogs.ts`
2. `src/hooks/useDailyLogs.ts`
3. A snippet showing the `onSubmit` and Button implementation for `AnalysisForm.tsx`.
4. `src/pages/LogsPage.tsx`