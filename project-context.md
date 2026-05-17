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


