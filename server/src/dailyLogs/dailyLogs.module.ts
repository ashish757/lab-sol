import { Module } from '@nestjs/common';
import { DailyLogsController } from './dailyLogs.controller';
import { DailyLogsService } from './dailyLogs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DailyLogsController],
  providers: [DailyLogsService],
})
export class DailyLogsModule {}
