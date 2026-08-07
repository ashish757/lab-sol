import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DailyLogsModule } from '../dailyLogs/dailyLogs.module';
import { CalculationsModule } from '../calculations/calculations.module';

@Module({
  imports: [PrismaModule, DailyLogsModule, CalculationsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
