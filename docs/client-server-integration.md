# Client-Server Integration

The Enterprise Analysis Tool leverages modern HTTP synchronization patterns to ensure that the React client and NestJS server remain seamlessly connected without manual token gymnastics.

## Single Source of Truth Configurations
Both the client and server pull from the `shared/` directory.
- `routes.config.ts`: Ensures that an API endpoint change propagates simultaneously to the frontend fetchers and backend controllers.
- `analysisFields.ts`: Ensures the UI renders exactly the parameters that the backend Zod validation schema will expect.

## RTK Query State Synchronization
All network communications flow exclusively through Redux's `apiSlice.ts`.

### 1. Automated Token Injection
We utilize the `prepareHeaders` lifecycle method inside our `fetchBaseQuery` configuration. When a network request is dispatched, RTK Query automatically inspects the Redux `RootState`, extracts the active `auth.token`, and strictly injects it into the `Authorization: Bearer` header. This eradicates the need for manual Axios interceptors.

### 2. Automated Cache Invalidation
The frontend relies on declarative tag invalidation.
- When `useCreateUnitMutation` fires, it declares `invalidatesTags: ['Units', 'Organizations']`. 
- The moment the server responds with 201 Created, RTK Query immediately dumps its cache for `getOrganizations` and `getUnits`, instantly forcing the UI to refetch and reflect the updated data structures.

## Facade API Endpoints
To simplify client-side orchestration, the backend exposes highly opinionated Facade endpoints.
For example, `POST /api/reports/save-and-generate` performs:
1. Database Insertion
2. Rules Engine Calculation
3. Excel Template Hydration
4. Binary Blob Streaming

This prevents the client from having to make 4 separate HTTP requests and manage intermediate loading states, ensuring a snappy user experience.
