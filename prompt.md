# Context
We are building a NestJS backend for an enterprise React application. The application submits a large form (138 fields) representing a daily factory production log. We are using Prisma as our ORM with PostgreSQL. 

The Prisma model is already created and looks like this:
\`\`\`prisma
model DailyAnalysisLog {
  id        String   @id @default(uuid())
  logDate   DateTime @unique @map("log_date")
  metrics   Json
  status    String   @default("DRAFT")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  @@map("daily_analysis_logs")
}
\`\`\`

# Task
Generate a complete NestJS module named `dailyLogs` (Controller, Service, Module, and DTO) to handle the incoming form submissions.

# Strict Technical Constraints
1. **DTO Validation:** Use standard NestJS `class-validator` and `class-transformer` for DTO validation.
2. **DTO Structure:** Create an `UpsertDailyLogDto`. It must require `logDate` (validate as a date string) and `metrics` (validate as a non-empty object). 
3. **Upsert Logic:** In the Service, use Prisma's `upsert` method. Look up the record by `logDate`. 
    - If it exists, update the `metrics` and set status to "SUBMITTED".
    - If it does not exist, create a new record with the `logDate`, `metrics`, and status "SUBMITTED".
4. **Date Handling:** Ensure the incoming `logDate` string (e.g., "2026-05-17") is properly converted into a JavaScript `Date` object before being passed to Prisma.

# Expected Output
Please provide the complete code for the following files:
1. `src/dailyLogs/dto/upsertDailyLog.dto.ts`
2. `src/dailyLogs/dailyLogs.service.ts`
3. `src/dailyLogs/dailyLogs.controller.ts`
4. `src/dailyLogs/dailyLogs.module.ts`