# Architecture

The Enterprise Analysis Tool uses a Monorepo architecture containing both the frontend client and the backend server.

## Directory Structure

```text
project/
├── client/     # React + Vite Frontend
├── server/     # NestJS + Prisma Backend
└── docs/       # Project Documentation
```

## Monorepo Strategy

- **Client**: Responsible for high-performance UI and capturing ~30 data points efficiently.
- **Server**: Responsible for proprietary calculations, database interactions, and report generation (PDF/Excel).
- **Shared Code**: We use Zod schemas (like `analysisSchema.ts`) and TypeScript interfaces that can be shared or mirrored across both the client and server to guarantee data consistency.

## Data Flow

1. The internal analyst enters data into the client application.
2. The client validates the input instantly using Zod schemas.
3. Once validated, the data is sent to the server.
4. The server processes the data using its secure proprietary math logic.
5. The server stores the results and/or generates the requested reports.
6. The client displays the results or provides download links for the reports.
