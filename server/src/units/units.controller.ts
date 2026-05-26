import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UnitsService } from './units.service';
import { apiRoutes } from '@shared/routes.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUnitDto } from './dto/createUnit.dto';
import { Role } from '@prisma/client';

@Controller(apiRoutes.units.base)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post(apiRoutes.units.create)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ORG_ADMIN)
  async createUnit(@Body() dto: CreateUnitDto, @Req() request: any) {
    const orgId = request.user.orgId;
    return this.unitsService.createUnit(orgId, dto);
  }

  @Get(apiRoutes.units.getOne)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.ORG_STAFF, Role.UNIT_OPERATOR)
  async getUnitById(@Param('id') id: string, @Req() request: any) {
    const currentUser = request.user;
    const unit = await this.unitsService.getUnitById(id);
    
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (currentUser.role === Role.UNIT_OPERATOR && currentUser.unitId !== id) {
      throw new ForbiddenException('You can only view your own unit.');
    }

    if ((currentUser.role === Role.ORG_ADMIN || currentUser.role === Role.ORG_STAFF) && currentUser.orgId !== unit.orgId) {
      throw new ForbiddenException('You can only view units within your organization.');
    }

    return unit;
  }

  @Patch(apiRoutes.units.update)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ORG_ADMIN)
  async updateUnit(@Param('id') id: string, @Body() dto: { name: string }, @Req() req: any) {
    const orgId = req.user.orgId;
    return this.unitsService.updateUnit(id, orgId, dto.name);
  }

  @Delete(apiRoutes.units.delete)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ORG_ADMIN)
  async deleteUnit(@Param('id') id: string, @Req() req: any) {
    const orgId = req.user.orgId;
    return this.unitsService.deleteUnit(id, orgId);
  }
}
