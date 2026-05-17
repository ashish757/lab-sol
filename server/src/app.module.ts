import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DailyLogsModule } from './dailyLogs/dailyLogs.module';

@Module({
  imports: [AuthModule, DailyLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
