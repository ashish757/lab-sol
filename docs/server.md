# Server Documentation

The backend of the Enterprise Analysis Tool is responsible for secure calculations and report generation.

## Tech Stack

- **Framework**: NestJS
- **Database ORM**: Prisma
- **Database**: (To be defined, typically PostgreSQL)

## Core Responsibilities

1. **"Secret Math"**: All proprietary calculations are executed on the server. This guarantees that internal business logic is never exposed to the client bundle.
2. **Data Storage**: Securely persisting analyst inputs and calculation results.
3. **Report Generation**: Generating high-fidelity enterprise reports in PDF and Excel formats.

## Security Constraints

- Under no circumstances should calculation logic be moved to the client.
- All incoming requests must be strictly validated against the expected Zod schemas.
