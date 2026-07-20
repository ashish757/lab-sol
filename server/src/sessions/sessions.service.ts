import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async getActiveSession(unitId: string) {
    return this.prisma.sessionData.findFirst({
      where: { unitId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertSessionData(
    unitId: string,
    orgId: string,
    payload: {
      sessionStartDate?: string;
      sessionStartTime?: string;
      sessionOffDate?: string;
      sessionOffTime?: string;
      dayStartTime?: string;
      plantName?: string;
      plantCode?: string;
      crushingCapacity?: string;
      crushingSeason?: string;
    },
    user: any
  ) {
    let session = await this.getActiveSession(unitId);

    if (session && session.isLocked) {
      // If locked, we only allow updating the off date/time
      if (
        (payload.sessionStartDate && payload.sessionStartDate !== session.sessionStartDate) ||
        (payload.sessionStartTime && payload.sessionStartTime !== session.sessionStartTime) ||
        (payload.dayStartTime && payload.dayStartTime !== session.dayStartTime) ||
        (payload.plantName && payload.plantName !== session.plantName) ||
        (payload.plantCode && payload.plantCode !== session.plantCode) ||
        (payload.crushingCapacity && payload.crushingCapacity !== session.crushingCapacity) ||
        (payload.crushingSeason && payload.crushingSeason !== session.crushingSeason)
      ) {
        throw new BadRequestException('Cannot edit start dates or day start time of a locked session.');
      }

      session = await this.prisma.sessionData.update({
        where: { id: session.id },
        data: {
          sessionOffDate: payload.sessionOffDate ?? session.sessionOffDate,
          sessionOffTime: payload.sessionOffTime ?? session.sessionOffTime,
          updatedById: user.userId,
          updatedByEmail: user.email,
          updatedByName: user.name,
        },
      });
    } else if (session && !session.isLocked) {
      // If unlocked, update all fields
      session = await this.prisma.sessionData.update({
        where: { id: session.id },
        data: {
          sessionStartDate: payload.sessionStartDate ?? session.sessionStartDate,
          sessionStartTime: payload.sessionStartTime ?? session.sessionStartTime,
          sessionOffDate: payload.sessionOffDate ?? session.sessionOffDate,
          sessionOffTime: payload.sessionOffTime ?? session.sessionOffTime,
          dayStartTime: payload.dayStartTime ?? session.dayStartTime,
          plantName: payload.plantName ?? session.plantName,
          plantCode: payload.plantCode ?? session.plantCode,
          crushingCapacity: payload.crushingCapacity ?? session.crushingCapacity,
          crushingSeason: payload.crushingSeason ?? session.crushingSeason,
          updatedById: user.userId,
          updatedByEmail: user.email,
          updatedByName: user.name,
        },
      });
    } else {
      // No session exists, create a new one
      session = await this.prisma.sessionData.create({
        data: {
          unitId,
          orgId,
          sessionStartDate: payload.sessionStartDate,
          sessionStartTime: payload.sessionStartTime,
          sessionOffDate: payload.sessionOffDate,
          sessionOffTime: payload.sessionOffTime,
          dayStartTime: payload.dayStartTime,
          plantName: payload.plantName,
          plantCode: payload.plantCode,
          crushingCapacity: payload.crushingCapacity,
          crushingSeason: payload.crushingSeason,
          createdById: user.userId,
          createdByEmail: user.email,
          createdByName: user.name,
        },
      });
    }

    // Sync to Unit model
    await this.prisma.unit.update({
      where: { id: unitId },
      data: {
        seasonStartDate: session.sessionStartDate,
        seasonStartTime: session.sessionStartTime,
        seasonEndDate: session.sessionOffDate,
        seasonEndTime: session.sessionOffTime,
      },
    });

    return session;
  }

  async lockSessionData(id: string, user: any) {
    const session = await this.prisma.sessionData.findUnique({ where: { id } });
    if (!session) {
      throw new BadRequestException('Session not found.');
    }
    if (session.isLocked) {
      throw new BadRequestException('Session is already locked.');
    }
    if (!session.sessionStartDate || !session.sessionStartTime || !session.dayStartTime) {
      throw new BadRequestException('Start date, start time, and day start time are required before locking.');
    }

    const lockedSession = await this.prisma.sessionData.update({
      where: { id },
      data: {
        isLocked: true,
        lockedAt: new Date(),
        updatedById: user.userId,
        updatedByEmail: user.email,
        updatedByName: user.name,
      },
    });

    return lockedSession;
  }
}
