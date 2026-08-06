import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DailyLogsModule } from './dailyLogs/dailyLogs.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UnitsModule } from './units/units.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { SessionsModule } from './sessions/sessions.module';
import { CalculationsModule } from './calculations/calculations.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
      },
    }),
    AuthModule, DailyLogsModule, ReportsModule, PrismaModule, OrganizationsModule, UnitsModule, UsersModule, MailModule, SessionsModule, CalculationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
