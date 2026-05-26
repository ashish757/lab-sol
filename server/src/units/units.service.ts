import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/createUnit.dto';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async createUnit(orgId: string, dto: CreateUnitDto) {
    return this.prisma.unit.create({
      data: {
        name: dto.name,
        orgId,
      },
    });
  }

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

  async updateUnit(id: string, orgId: string, name: string) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit || unit.orgId !== orgId) {
      throw new NotFoundException('Unit not found in your organization');
    }

    try {
      return await this.prisma.unit.update({
        where: { id },
        data: { name },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Unit name already exists in your organization');
      }
      throw error;
    }
  }

  async deleteUnit(id: string, orgId: string) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit || unit.orgId !== orgId) {
      throw new NotFoundException('Unit not found in your organization');
    }

    return this.prisma.unit.delete({ where: { id } });
  }
}
