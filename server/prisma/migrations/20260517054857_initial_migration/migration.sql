-- CreateTable
CREATE TABLE "daily_analysis_logs" (
    "id" TEXT NOT NULL,
    "log_date" TIMESTAMP(3) NOT NULL,
    "metrics" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_analysis_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_analysis_logs_id_key" ON "daily_analysis_logs"("id");
