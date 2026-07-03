import { Module, forwardRef } from '@nestjs/common';
import { DailyLogsController } from './dailyLogs.controller';
import { DailyLogsService } from './dailyLogs.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CalculationsModule } from '../calculations/calculations.module';

@Module({
  imports: [PrismaModule, forwardRef(() => CalculationsModule)],
  controllers: [DailyLogsController],
  providers: [DailyLogsService],
  exports: [DailyLogsService],
})
export class DailyLogsModule {}
