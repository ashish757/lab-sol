import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertDailyLogDto } from './dto/dailyLog.dto';
import { Prisma, Role, LogStatus, LogDayType } from '@prisma/client';
import { CalculationsService } from '../calculations/calculations.service';

@Injectable()
export class DailyLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculationsService: CalculationsService,
  ) {}

  async autoLockAndFillMissedDays(unitId: string, orgId: string, sessionData: any) {
    if (!sessionData || !sessionData.isLocked || !sessionData.sessionStartDate) return;

    const [h, m] = (sessionData.dayStartTime || '00:00').split(':').map(Number);
    const now = new Date();

    // 1. Lock existing unlocked logs whose window has passed
    const unlockedLogs = await this.prisma.dailyLog.findMany({
      where: { unitId, sessionDataId: sessionData.id, status: LogStatus.UNLOCKED }
    });

    for (const log of unlockedLogs) {
      const closeDate = new Date(log.createdAt);
      closeDate.setUTCDate(closeDate.getUTCDate() + 2);
      closeDate.setUTCHours(h, m, 0, 0);

      if (now > closeDate) {
        await this.prisma.dailyLog.update({
          where: { id: log.id },
          data: { status: LogStatus.LOCKED, lockedAt: new Date() }
        });
      }
    }

    // 2. Find missing days and create MISSED_SHUTDOWN if window has passed
    const logs = await this.prisma.dailyLog.findMany({
      where: { unitId, sessionDataId: sessionData.id },
      select: { createdAt: true }
    });
    
    const existingDates = new Set(logs.map(l => l.createdAt.toISOString().split('T')[0]));
    const currentDate = new Date(`${sessionData.sessionStartDate}T00:00:00Z`);
    
    while (true) {
      const closeDate = new Date(currentDate);
      closeDate.setUTCDate(closeDate.getUTCDate() + 2);
      closeDate.setUTCHours(h, m, 0, 0);
      
      if (now <= closeDate) break; // Upload window is still open
      
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (sessionData.sessionOffDate && dateStr > sessionData.sessionOffDate) break;

      if (!existingDates.has(dateStr)) {
        await this.prisma.dailyLog.create({
          data: {
            createdAt: new Date(`${dateStr}T00:00:00Z`),
            status: LogStatus.LOCKED,
            lockedAt: new Date(),
            dayType: LogDayType.MISSED_SHUTDOWN,
            payload: {},
            unitId,
            orgId,
            sessionDataId: sessionData.id,
          }
        });
        existingDates.add(dateStr);
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
  }

  async getLogsForUnit(unitId: string) {
    const session = await this.prisma.sessionData.findFirst({
      where: { unitId, isLocked: true },
      orderBy: { createdAt: 'desc' }
    });

    if (session) {
      // Find orgId from unit to run auto-lock
      const unit = await this.prisma.unit.findUnique({ where: { id: unitId }});
      if (unit) {
        await this.autoLockAndFillMissedDays(unitId, unit.orgId, session);
      }
    }

    return this.prisma.dailyLog.findMany({
      where: { unitId },
      orderBy: { createdAt: 'desc' },
      include: {
        unit: { select: { id: true, name: true } },
      },
    });
  }

  async upsertLog(unitId: string, orgId: string, currentUser: any, dto: UpsertDailyLogDto & { dayType?: LogDayType }) {
    const requestedDate = new Date(dto.createdAt);

    const session = await this.prisma.sessionData.findFirst({
      where: { unitId, isLocked: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!session) {
      throw new BadRequestException('No active locked session data found. Please contact admin to lock session data first.');
    }

    await this.autoLockAndFillMissedDays(unitId, orgId, session);

    if (session.sessionOffDate) {
      const requestedDateStr = requestedDate.toISOString().split('T')[0];
      if (requestedDateStr > session.sessionOffDate) {
        throw new BadRequestException('The session has ended.');
      }
    }

    const [h, m] = (session.dayStartTime || '00:00').split(':').map(Number);
    const dayEndDate = new Date(requestedDate);
    dayEndDate.setUTCDate(dayEndDate.getUTCDate() + 1);
    dayEndDate.setUTCHours(h, m, 0, 0);

    const now = new Date();
    if (now < dayEndDate) {
      throw new BadRequestException('The day has not ended yet. You can only log data after the day is complete.');
    }

    const existingLog = await this.prisma.dailyLog.findUnique({
      where: { unitId_createdAt: { unitId, createdAt: requestedDate } },
    });

    if (existingLog && existingLog.status === LogStatus.LOCKED) {
      throw new ForbiddenException('Upload window for this date has closed. Log is locked and cannot be edited.');
    }

    const allLogs = await this.prisma.dailyLog.findMany({
      where: { unitId, sessionDataId: session.id },
      orderBy: { createdAt: 'asc' },
    });

    let nextExpectedDate: string | null = null;
    let missingOrUnlocked = false;

    const seasonStartDateStr = session.sessionStartDate!;
    const currentDate = new Date(`${seasonStartDateStr}T00:00:00Z`);

    if (allLogs.length > 0) {
      for (const log of allLogs) {
        const logDateStr = log.createdAt.toISOString().split('T')[0];
        const currentDateStr = currentDate.toISOString().split('T')[0];

        if (logDateStr < seasonStartDateStr) continue;

        if (logDateStr > currentDateStr) {
          nextExpectedDate = currentDateStr;
          missingOrUnlocked = true;
          break;
        }

        if (log.status === LogStatus.UNLOCKED) {
          nextExpectedDate = logDateStr;
          missingOrUnlocked = true;
          break;
        }

        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }

      if (!missingOrUnlocked) {
        nextExpectedDate = currentDate.toISOString().split('T')[0];
      }
    } else {
      nextExpectedDate = seasonStartDateStr;
    }

    const requestedDateStr = requestedDate.toISOString().split('T')[0];

    if (nextExpectedDate && requestedDateStr > nextExpectedDate) {
      throw new BadRequestException(`Sequential upload required. You must complete data for ${nextExpectedDate} first.`);
    }

    const sanitizedPayload = { ...(dto.payload as Record<string, any>) };

    const savedLog = await this.prisma.dailyLog.upsert({
      where: { unitId_createdAt: { unitId, createdAt: requestedDate } },
      update: {
        payload: sanitizedPayload as Prisma.InputJsonValue,
        dayType: dto.dayType ?? LogDayType.NORMAL,
        updatedById: currentUser?.id,
        updatedByEmail: currentUser?.email,
        updatedByName: currentUser?.name,
      },
      create: {
        createdAt: requestedDate,
        payload: sanitizedPayload as Prisma.InputJsonValue,
        status: LogStatus.UNLOCKED,
        dayType: dto.dayType ?? LogDayType.NORMAL,
        unitId: unitId,
        orgId: orgId,
        sessionDataId: session.id,
        createdById: currentUser?.id,
        createdByEmail: currentUser?.email,
        createdByName: currentUser?.name,
        updatedById: currentUser?.id,
        updatedByEmail: currentUser?.email,
        updatedByName: currentUser?.name,
      },
    });

    // Auto-calculate required metrics and save to DailyCalculation table
    await this.calculationsService.processCalculations(savedLog.id, sanitizedPayload);

    return savedLog;
  }

  async findAll(currentUser: any) {
    let whereClause = {};
    if (currentUser.role === Role.ORG_ADMIN || currentUser.role === Role.ORG_STAFF) {
      whereClause = { orgId: currentUser.orgId };
    } else if (currentUser.role === Role.UNIT_OPERATOR) {
      whereClause = { unitId: currentUser.unitId };
    }

    return this.prisma.dailyLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        unit: { select: { id: true, name: true } }
      }
    });
  }

  async findByDate(dateString: string, currentUser: any) {
    const start = new Date(dateString);
    const end = new Date(dateString);
    end.setDate(end.getDate() + 1);

    const whereClause: any = {
      createdAt: { gte: start, lt: end },
    };

    if (currentUser.role === Role.ORG_ADMIN || currentUser.role === Role.ORG_STAFF) {
      whereClause.orgId = currentUser.orgId;
    } else if (currentUser.role === Role.UNIT_OPERATOR) {
      whereClause.unitId = currentUser.unitId;
    }

    return this.prisma.dailyLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        unit: { select: { id: true, name: true } }
      }
    });
  }

  async findOne(id: string, currentUser: any) {
    const whereClause: any = { id };
    
    if (currentUser.role === Role.ORG_ADMIN || currentUser.role === Role.ORG_STAFF) {
      whereClause.orgId = currentUser.orgId;
    } else if (currentUser.role === Role.UNIT_OPERATOR) {
      whereClause.unitId = currentUser.unitId;
    }

    return this.prisma.dailyLog.findUnique({
      where: whereClause,
    });
  }
}

