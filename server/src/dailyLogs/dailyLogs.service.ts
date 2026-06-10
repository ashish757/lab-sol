import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertDailyLogDto } from './dto/dailyLog.dto';
import { Prisma, Role, LogStatus } from '@prisma/client';

@Injectable()
export class DailyLogsService {
  constructor(private readonly prisma: PrismaService) {}

  // --- New Methods as per requirements ---

  async getLogsForUnit(unitId: string) {
    return this.prisma.dailyLog.findMany({
      where: { unitId },
      orderBy: { createdAt: 'desc' },
      include: {
        unit: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async upsertLog(unitId: string, orgId: string, dto: UpsertDailyLogDto) {
    const requestedDate = new Date(dto.createdAt);

    // Validation A: Check if log for this date already exists and is locked
    const existingLog = await this.prisma.dailyLog.findUnique({
      where: {
        unitId_createdAt: {
          unitId,
          createdAt: requestedDate,
        },
      },
    });

    if (existingLog && existingLog.status === LogStatus.LOCKED) {
      throw new ForbiddenException('Log is locked and cannot be edited');
    }

    // Validation B (Sequential Rule)
    // Operators cannot create or edit a log for Date X if a day before Date X is missing or unlocked.
    const allLogs = await this.prisma.dailyLog.findMany({
      where: { unitId },
      orderBy: { createdAt: 'asc' },
    });

    let nextExpectedDate: string | null = null;
    let missingOrUnlocked = false;

    if (allLogs.length > 0) {
      const earliestDateStr = allLogs[0].createdAt.toISOString().split('T')[0];
      const currentDate = new Date(`${earliestDateStr}T00:00:00Z`);

      for (const log of allLogs) {
        const logDateStr = log.createdAt.toISOString().split('T')[0];
        const currentDateStr = currentDate.toISOString().split('T')[0];

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
    }

    const requestedDateStr = requestedDate.toISOString().split('T')[0];

    if (nextExpectedDate && requestedDateStr > nextExpectedDate) {
      throw new BadRequestException(`Sequential upload required. You must complete data for ${nextExpectedDate} first.`);
    }

    // Action: Upsert
    return this.prisma.dailyLog.upsert({
      where: {
        unitId_createdAt: {
          unitId,
          createdAt: requestedDate,
        },
      },
      update: {
        payload: dto.payload as Prisma.InputJsonValue,
      },
      create: {
        createdAt: requestedDate,
        payload: dto.payload as Prisma.InputJsonValue,
        status: LogStatus.UNLOCKED,
        unitId: unitId,
        orgId: orgId,
      },
    });
  }

  async lockLog(logId: string, unitId: string) {
    const existingLog = await this.prisma.dailyLog.findUnique({
      where: { id: logId },
    });

    if (!existingLog) {
      throw new NotFoundException('Log not found');
    }

    // Optional safety check to ensure users don't lock cross-unit logs
    if (existingLog.unitId !== unitId) {
      throw new ForbiddenException('You cannot lock a log belonging to another unit');
    }

    return this.prisma.dailyLog.update({
      where: { id: logId },
      data: { 
        status: LogStatus.LOCKED,
        lockedAt: new Date(),
      },
    });
  }

  // --- Adapted Legacy Methods ---

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
        unit: {
          select: { id: true, name: true }
        }
      }
    });
  }

  async findByDate(dateString: string, currentUser: any) {
    const start = new Date(dateString);
    const end = new Date(dateString);
    end.setDate(end.getDate() + 1);

    const whereClause: any = {
      createdAt: {
        gte: start,
        lt: end,
      },
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
        unit: {
          select: { id: true, name: true }
        }
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
