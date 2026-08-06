import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/createUnit.dto';
import { UpdateUnitDto } from './dto/updateUnit.dto';

@Injectable()
export class UnitsService {
  private readonly logger = new Logger(UnitsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUnit(orgId: string, dto: CreateUnitDto) {
    const unit = await this.prisma.unit.create({
      data: {
        name: dto.name,
        orgId,
      },
    });
    
    this.logger.log(`Created new unit ${unit.id} ('${unit.name}') for org ${orgId}`);
    
    return unit;
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

  async updateUnit(id: string, orgId: string, dto: UpdateUnitDto) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit || unit.orgId !== orgId) {
      this.logger.warn(`Failed to update unit ${id}: Unit not found or belongs to different org`);
      throw new NotFoundException('Unit not found in your organization');
    }

    try {
      const updatedUnit = await this.prisma.unit.update({
        where: { id },
        data: dto,
      });
      
      this.logger.log(`Updated unit ${id} in org ${orgId}`);
      
      return updatedUnit;
    } catch (error: any) {
      if (error.code === 'P2002') {
        this.logger.warn(`Failed to update unit ${id}: Name collision for '${dto.name}'`);
        throw new BadRequestException('Unit name already exists in your organization');
      }
      throw error;
    }
  }

  async deleteUnit(id: string, orgId: string) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit || unit.orgId !== orgId) {
      this.logger.warn(`Failed to delete unit ${id}: Unit not found or belongs to different org`);
      throw new NotFoundException('Unit not found in your organization');
    }

    await this.prisma.unit.delete({ where: { id } });
    
    this.logger.log(`Deleted unit ${id} from org ${orgId}`);
    
    return { success: true, message: 'Unit deleted' };
  }
}
