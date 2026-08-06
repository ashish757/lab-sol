-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('UNLOCKED', 'LOCKED');

-- CreateEnum
CREATE TYPE "LogDayType" AS ENUM ('NORMAL', 'SHUTDOWN', 'MISSED_SHUTDOWN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'ORG_STAFF', 'UNIT_OPERATOR');

-- CreateTable
CREATE TABLE "daily_logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "status" "LogStatus" NOT NULL DEFAULT 'UNLOCKED',
    "locked_at" TIMESTAMP(3),
    "dayType" "LogDayType" NOT NULL DEFAULT 'NORMAL',
    "metrics" JSONB NOT NULL,
    "unitId" TEXT NOT NULL,
    "sessionDataId" TEXT,
    "orgId" TEXT NOT NULL,
    "createdById" TEXT,
    "createdByEmail" TEXT,
    "createdByName" TEXT,
    "updatedById" TEXT,
    "updatedByEmail" TEXT,
    "updatedByName" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_calculations" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "calculated_metrics" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_data" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "sessionStartDate" TEXT,
    "sessionStartTime" TEXT,
    "sessionOffDate" TEXT,
    "sessionOffTime" TEXT,
    "dayStartTime" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "locked_at" TIMESTAMP(3),
    "plantName" TEXT,
    "plantCode" TEXT,
    "crushingCapacity" TEXT,
    "crushingSeason" TEXT,
    "createdById" TEXT,
    "createdByEmail" TEXT,
    "createdByName" TEXT,
    "updatedById" TEXT,
    "updatedByEmail" TEXT,
    "updatedByName" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "seasonStartDate" TEXT,
    "seasonStartTime" TEXT,
    "seasonEndDate" TEXT,
    "seasonEndTime" TEXT,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "role" "Role" NOT NULL,
    "orgId" TEXT,
    "unitId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InviteToken" (
    "id" TEXT NOT NULL,
    "tokenString" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "orgId" TEXT NOT NULL,
    "unitId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_id_key" ON "daily_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_unitId_created_at_key" ON "daily_logs"("unitId", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "daily_calculations_dailyLogId_key" ON "daily_calculations"("dailyLogId");

-- CreateIndex
CREATE INDEX "session_data_unitId_isLocked_idx" ON "session_data"("unitId", "isLocked");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_orgId_key" ON "Unit"("name", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InviteToken_tokenString_key" ON "InviteToken"("tokenString");

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_sessionDataId_fkey" FOREIGN KEY ("sessionDataId") REFERENCES "session_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_calculations" ADD CONSTRAINT "daily_calculations_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_data" ADD CONSTRAINT "session_data_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_data" ADD CONSTRAINT "session_data_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_data" ADD CONSTRAINT "session_data_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_data" ADD CONSTRAINT "session_data_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
