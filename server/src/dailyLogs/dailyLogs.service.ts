import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertDailyLogDto } from './dto/dailyLog.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DailyLogsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: UpsertDailyLogDto) {
    const logDate = new Date(dto.logDate);

    return this.prisma.dailyAnalysisLog.create({
      data: {
        logDate,
        metrics: dto.metrics as Prisma.InputJsonValue,
      },
    });
  }

  async findAll() {
    return this.prisma.dailyAnalysisLog.findMany({
      orderBy: { logDate: 'desc' },
    });
  }

  async findByDate(date: string) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    return this.prisma.dailyAnalysisLog.findMany({
      where: {
        logDate: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
