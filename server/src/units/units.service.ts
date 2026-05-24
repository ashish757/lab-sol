import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUnitById(id: string) {
    return this.prisma.unit.findUnique({
      where: { id },
      include: {
        org: {
          select: { name: true },
        },
        users: {
          select: { id: true, email: true, role: true },
        },
        _count: {
          select: { users: true },
        },
      },
    });
  }
}
