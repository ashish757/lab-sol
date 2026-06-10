# Server Documentation

The backend of the Enterprise Analysis Tool is responsible for secure calculations, authentication logic, and dynamic report generation.

## Tech Stack

- **Framework**: NestJS
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Azure DB for PostgreSQL)

## Core Responsibilities

1. **"Secret Math"**: All proprietary calculations are executed safely on the server.
2. **Data Storage**: Securely persisting analyst inputs and generated metrics.
3. **Report Generation**: Generating high-fidelity enterprise reports by dynamically populating Excel spreadsheets.

## Key Architectures

### Factory Report Rules Engine
To handle sequentially dependent formulas (e.g., where `yieldEst` relies on `totalSugarBagged` which relies on `totalCaneCrushed`), the server utilizes a `calculateReportData` pipeline (`report.engine.ts`). 
- It establishes a `FormulaRegistry` mapping field IDs to execution logic.
- Input payloads are deep-cloned to keep calculations side-effect-free.
- Unregistered fields are passed through without throwing, ensuring extreme resilience.

### Dynamic Excel Report Data Populator
The system uses `reports.utils.ts` to read an existing `daily_report_template.xlsx`.
- **Formula Preservation**: Chemical analysis entries (Juices, molasses, massecuites) strictly write Brix values to Column B and Pol values to Column C. Column D is deliberately avoided to completely preserve complex Excel Purity formulas pre-configured in the template.
- **Facade Save & Generate**: The endpoint `POST /api/reports/save-and-generate` coordinates everything in a single stroke: Saving the database log, running the Rules Engine, writing to the Excel file, and streaming the binary Blob directly back to the client.

### Magic Link Onboarding
Authentication relies on a decentralized Magic Link system.
- SuperAdmins and OrgAdmins invite entities using email. The backend creates an `InviteToken` (UUID) with a status of `INACTIVE`.
- Users navigate to the public frontend to configure their password and name. The backend completes the registration, hashes the credentials, flags the token as consumed, and sets the account to `ACTIVE`.

## Security Constraints
- Under no circumstances should calculation logic be moved to the client.
- All incoming requests must be strictly validated against Zod schemas.
