---
trigger: always_on
---

# Project Overview & Business Logic

## The Product
- **Name:** Enterprise Analysis Tool
- **Core Function:** A high-performance web and desktop application that processes ~30 complex inputs to perform proprietary calculations and generate enterprise reports (PDF/Excel).
- **Users:** Internal analysts who require data accuracy and low-latency input handling.

## Monorepo Architecture
- **Root Directory:** Contains `client/` and `server/`.
- **Client:** React + Vite (Frontend). High-performance data entry and advanced metrics dashboard.
- **Server:** NestJS + Prisma (Backend). Focus on "Secret Math" logic and document generation.
- **Shared:** (If applicable) Shared Zod schemas and TypeScript interfaces.

## State & Routing Access Control
- **RTK Query Transition**: Successfully eradicated Axios and TanStack Query, unifying all data fetching pipelines natively through `@reduxjs/toolkit/query/react`. Request payloads automatically map Redux state configurations mapping secure user `Authorization: Bearer` headers dynamically into the `apiSlice`.
- **RBAC Protected Route Wrappers**: Enforced strict Role-Based Access Control logic via an intelligent dynamic routing component array (`routeConf.ts`). Dashboard mount points evaluate strict `SUPER_ADMIN`, `ORG_ADMIN`, `UNIT_ADMIN`, and `UNIT_OPERATOR` Prisma schema rules directly against Redux's deserialized authentication session payload. Unauthenticated endpoints forcefully redirect invalid requests immediately back to localized `/unauthorized` rendering layers.
- **Strict Dash Namespace Taxonomy**: All internal routes are hard-sandboxed under the `/dash/` namespace (e.g., `/operator/dash/home`, `/admin/dash/invite`). All bare requests (like `/`) are strictly routed to the operator home if authenticated, ensuring zero unprotected entry points exist within `App.tsx`.

## Instruction to Agent
- When working on the **Client**, always reference the business goals in this file to ensure the UI supports high-density data entry.
- When working on the **Server**, ensure the math logic is robust and follows the enterprise reporting requirements.
- Use no to ver minimal comments in code.
- Keep the code clean and modular.

## Validation & Form Architecture
- **Dynamic Form Schema:** The client-side validation schema ([analysisSchema.ts](file:///Users/ashish/Developer/project/client/src/types/analysisSchema.ts)) is generated dynamically from the primary UI configuration ([analysisConfig.ts](file:///Users/ashish/Developer/project/client/src/features/analysis/analysisConfig.ts)). This avoids duplicate mapping definitions and ensures synchronization.
- **Optional Form Inputs:** By default, fields are optional. Zod preprocessors dynamically convert empty string inputs and `NaN` (returned by native HTML empty number fields) to `undefined`, allowing analysts to submit partially filled reports.
- **Required Validation:** Fields can be set as strictly required by adding `required: true` inside their field configuration within [analysisConfig.ts](file:///Users/ashish/Developer/project/client/src/features/analysis/analysisConfig.ts). Asterisks are automatically rendered next to their labels, and inline validation warnings are displayed under erroneous inputs.

## Decoupled Routing & Report Generation
- **Decoupled Workflow:** The daily production entry form is located at `/log/new`. On submission, the form data is decoupled and forwarded to `/analysis/new` using the router's state context, freeing the entry form from handling async loading overlays.
- **Simulation Loading Phase:** Under `/analysis/new`, a premium corporate loading phase is simulated (e.g. "Calculating Sugar Recovery...", "Securing to PostgreSQL...") while the upsert mutation runs. Once finished, the URL is automatically replaced with `/analysis/:id` representing the database log UUID.
- **Past Report Viewers:** The `/analysis/:id` path retrieves historical analytics summaries by UUID directly from NestJS and database records, showing a read-only, print-friendly analysis summary dashboard.
- **Config-Driven Endpoints:** All client pages and backend API endpoints are strictly imported and driven by a central, maintainable configuration inside [routesConfig.ts](file:///Users/ashish/Developer/project/client/src/config/routesConfig.ts).

## Unified Monorepo Configuration Sharing
- **Single Source of Truth:** Bootstrapped the root [shared/](file:///Users/ashish/Developer/project/shared) directory containing the unified [analysisFields.ts](file:///Users/ashish/Developer/project/shared/analysisFields.ts) schema. Both front-end and back-end inherit their field list parameters and TypeScript grouping structures from this single file.
- **Client Imports:** Configured Vite's dev server serve permissions inside [vite.config.ts](file:///Users/ashish/Developer/project/client/vite.config.ts) to permit external parent serving (`server: { fs: { allow: ['..'] } }`), allowing seamless hot-reloads of shared configurations.

## Unified Excel Report Data Populator
- **Dynamic Excel Processing:** Built an intelligent utility that processes the Excel template `daily_report_template.xlsx` to dynamically write numbers or formatted Date/Time values into the `rawData` worksheet.
- **Formula Preservation:** For chemical analysis entries (Juices, molasses, massecuites), Brix values are written to Column B, and Pol values are written to Column C. Column D is left untouched, preserving the complex pre-configured Excel formulas (Purity calculation) completely intact.
- **Decoupled Configuration & Utilities:**
  - **Shared Configurations:** Created [excelMapping.ts](file:///Users/ashish/Developer/project/shared/excelMapping.ts) in the `shared/` folder, separating cell coordinates and row indices (`EXCEL_ROW_SINGLE_VALUES`, `EXCEL_ROW_BRIX_POL`) from application logic.
  - **Isolated Cell Populator Utility:** Created [reports.utils.ts](file:///Users/ashish/Developer/project/server/src/reports/reports.utils.ts), encapsulating data processing, type safety validations, cell writes, and date formatting inside `populateRow()`.
  - **Clean Service:** Refactored [reports.service.ts](file:///Users/ashish/Developer/project/server/src/reports/reports.service.ts) to delegate Excel row operations to the utility file, leaving the service strictly focused on workflow tasks (template loading, DB fetch, stream responses).
- **Decoupled Business Access:**
  1. **GET /api/reports/daily/download/:id:** Queries saved historical logs from the PostgreSQL database, parses JSON metrics, and streams the finished file to the browser.
  2. **POST /api/reports/daily/preview:** Accepts raw client-sent JSON data, populates the template on-the-fly, and streams the Excel file directly to the browser without database persistence, perfect for previewing drafts.

## Factory Report Rules Engine
- **Sequential Calculation Processor:** Created `calculateReportData` under [report.engine.ts](file:///Users/ashish/Developer/project/server/src/utils/report.engine.ts) to enrich raw daily report JSON input payloads with calculated fields.
- **Formula Registry Pattern:** Established `FormulaRegistry` where key field IDs are mapped to functions that consume the accumulating data structure. This facilitates sequential calculation and chain reactions (dependent fields like `yieldEst` correctly using the output of previously calculated fields like `totalCaneCrushed` and `totalSugarBagged`).
- **Immutability & Safety:** Ensures the input payload is deep-cloned to keep operations side-effect-free, and handles unregistered formula IDs gracefully without throwing.

## Facade Save and Download Action
- **Single-Request Workflow:** Created `POST /api/reports/save-and-generate` to support the single "Save and Download" facade action. It coordinates `DailyLogsService` to persist the raw log, runs the sequential `calculateReportData` engine on the metrics, generates the populated Excel workbook, and streams the finished file directly back to the client.
- **Client Integration:** The React frontend (under `/analysis/new` loader page) posts form data to this facade endpoint, automatically downloads the spreadsheet response as a binary blob, and navigates to `/analysis/:id` showing the historical metrics summary.
- **Nest CLI Path Alias Support:** Configured `entryFile: "server/src/main"` in `nest-cli.json` to handle the nested compilation output directory structure (`dist/server/src/main.js`) caused by importing files from the shared directory outside the server root.

## Magic Link Onboarding & Account Setup
- **Decoupled Registration:** Organizations and lower-tier users are invited via the SuperAdmin or OrgAdmin dashboards using a Magic Link system. Invited entities are initialized in the database with a `status` of `"INACTIVE"`.
- **Token Infrastructure:** An `InviteToken` (uuid) is generated and emailed to the target, encapsulating their target `role`, `orgId`, and optional `unitId`.
- **Public Setup Boundaries:** Invited users navigate to the public frontend routes (`/account/setup/org` or `/account/setup/user`), which fetch their pre-configured entity details dynamically. Upon successful password creation and name registration, the backend marks the token as used, hashes the password securely, and transitions the account status to `"ACTIVE"`.





