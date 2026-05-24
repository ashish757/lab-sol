import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DailyLogsModule } from './dailyLogs/dailyLogs.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [AuthModule, DailyLogsModule, ReportsModule, PrismaModule, OrganizationsModule, UnitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
