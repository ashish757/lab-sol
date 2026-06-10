# Architecture

The Enterprise Analysis Tool uses a Monorepo architecture to streamline development while keeping client and server boundaries strict.

## Directory Structure

```text
project/
├── client/     # React + Vite Frontend
├── server/     # NestJS + Prisma Backend
├── shared/     # Unified Zod Schemas and Route Configurations
└── docs/       # Project Documentation
```

## Monorepo Strategy

- **Client**: Responsible for high-performance UI and capturing ~30 data points efficiently.
- **Server**: Responsible for proprietary calculations, database interactions, and report generation (PDF/Excel).
- **Shared Code**: The newly established `shared/` directory serves as the single source of truth for both environments:
  - `analysisFields.ts`: Defines field boundaries and configuration parameters used by both the frontend forms and backend calculation engines.
  - `routes.config.ts`: Defines central string literal paths to prevent route mismatch errors between NestJS Controllers and Vite Client Requests.
  - `excelMapping.ts`: Manages Excel coordinate mappings independent of the calculation engine.

## Decoupled Data Flow & Report Generation

The project implements a decoupled architecture for daily entry and analysis presentation:

1. **Entry Phase (`/log/new`)**: The internal analyst enters data into the high-performance React application. Input is instantly validated via Zod.
2. **Simulation Phase (`/analysis/new`)**: Upon submission, the user is transitioned to a loading interface that simulates complex calculations (e.g., "Calculating Sugar Recovery...", "Securing to PostgreSQL..."). Behind the scenes, the client dispatches a request to `POST /api/reports/save-and-generate`.
3. **Backend Processing**: The NestJS server saves the raw data, triggers the **Factory Report Rules Engine** (`calculateReportData`) to sequentially cascade formulas, and populates the `daily_report_template.xlsx` safely without disturbing pre-existing formulas.
4. **Result Phase (`/analysis/:id`)**: The server streams back the generated Excel binary as a blob for automatic download, and the client redirects to the final view, which renders the historical read-only analysis metrics from the database.
