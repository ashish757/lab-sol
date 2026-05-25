import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsertDailyLogDto } from './dto/dailyLog.dto';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class DailyLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: InsertDailyLogDto, currentUser: any) {
    const logDate = new Date(dto.logDate);

    return this.prisma.dailyAnalysisLog.upsert({
      where: { logDate },
      update: {
        metrics: dto.metrics as Prisma.InputJsonValue,
      },
      create: {
        logDate,
        metrics: dto.metrics as Prisma.InputJsonValue,
        unitId: currentUser.unitId,
        orgId: currentUser.orgId,
      },
    });
  }

  async findAll(currentUser: any) {
    let whereClause = {};
    if (currentUser.role === Role.ORG_ADMIN || currentUser.role === Role.ORG_STAFF) {
      whereClause = { orgId: currentUser.orgId };
    } else if (currentUser.role === Role.UNIT_OPERATOR) {
      whereClause = { unitId: currentUser.unitId };
    }

    return this.prisma.dailyAnalysisLog.findMany({
      where: whereClause,
      orderBy: { logDate: 'desc' },
      include: {
        unit: {
          select: { id: true, name: true }
        }
      }
    });
  }

  async findByDate(date: string, currentUser: any) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const whereClause: any = {
      logDate: {
        gte: start,
        lt: end,
      },
    };

    if (currentUser.role === Role.ORG_ADMIN || currentUser.role === Role.ORG_STAFF) {
      whereClause.orgId = currentUser.orgId;
    } else if (currentUser.role === Role.UNIT_OPERATOR) {
      whereClause.unitId = currentUser.unitId;
    }

    return this.prisma.dailyAnalysisLog.findMany({
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

    return this.prisma.dailyAnalysisLog.findUnique({
      where: whereClause,
    });
  }
}
