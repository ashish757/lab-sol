import { Controller, Get, Param, Req, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UnitsService } from './units.service';
import { API_ROUTES } from '@shared/routes';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(API_ROUTES.UNITS.BASE)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get(API_ROUTES.UNITS.GET_ONE)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.UNIT_ADMIN, Role.UNIT_OPERATOR)
  async getUnitById(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    const unit = await this.unitsService.getUnitById(id);
    
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if ((user.role === Role.UNIT_ADMIN || user.role === Role.UNIT_OPERATOR) && user.unitId !== id) {
      throw new ForbiddenException('You can only view your own unit.');
    }

    if (user.role === Role.ORG_ADMIN && user.orgId !== unit.orgId) {
      throw new ForbiddenException('You can only view units within your organization.');
    }

    return unit;
  }
}
