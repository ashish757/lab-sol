# Client Documentation

The frontend of the Enterprise Analysis Tool is built to prioritize performant data entry, robust state management, and clear visualization.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite (Configured with `server.fs.allow: ['..']` to permit shared imports)
- **Styling**: Tailwind CSS v4
- **State & Data Fetching**: Redux Toolkit & RTK Query
- **Form Handling**: React Hook Form
- **Validation**: Zod & `@hookform/resolvers`
- **Routing**: React Router DOM

## Core Architecture

### State Management: RTK Query
We have successfully eradicated legacy Axios interceptors and TanStack query dependencies. The frontend utilizes `@reduxjs/toolkit/query/react` exclusively for all data fetching and mutation pipelines. RTK Query handles intelligent caching, automatic `Authorization` header injection via Redux state, and dynamic cache invalidation (e.g., automatically refreshing lists when a mutation fires).

### Zero Lag Data Entry & Validation
The daily log form contains ~30 complex inputs. Typing must be instantaneous. 
- We achieve zero lag by utilizing uncontrolled components via `react-hook-form` rather than relying on standard `useState` re-renders for every keystroke.
- The client-side validation schema (`analysisSchema.ts`) is generated dynamically from the primary UI configuration (`analysisConfig.ts`). This avoids duplicate mapping definitions. 
- By default, form fields are optional (converting empty inputs to `undefined`), allowing partial saves. Strict requirement validation is toggled using `required: true` in the configuration arrays.

### Strict Dash Namespace Taxonomy
All protected internal routes are hard-sandboxed under the `/dash/` namespace (e.g., `/org/dash`, `/admin/dash`, `/unit/dash`).
- Unauthenticated endpoints violently redirect unauthorized requests to `/login`.
- The root `/` intelligently redirects authenticated users directly to their designated dashboard context, preventing unprotected entry points.
