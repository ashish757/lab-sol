import { Body, Controller, Get, Param, Post, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { InviteOrgDto } from './dto/inviteOrg.dto';
import { API_ROUTES } from '@shared/routes';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(API_ROUTES.ORGANIZATIONS.BASE)
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post(API_ROUTES.ORGANIZATIONS.INVITE)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async invite(@Body() dto: InviteOrgDto) {
    return this.orgService.inviteOrganization(dto);
  }

  @Get(API_ROUTES.ORGANIZATIONS.GET_ALL)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAllOrganizations() {
    return this.orgService.getAllOrganizations();
  }

  @Get(API_ROUTES.ORGANIZATIONS.GET_ONE)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.ORG_STAFF)
  async getOrganizationById(@Param('id') id: string, @Req() request: any) {
    const currentUserRole = request.user.role;
    if ((currentUserRole === Role.ORG_ADMIN || currentUserRole === Role.ORG_STAFF) && request.user.orgId !== id) {
      throw new ForbiddenException('You can only view your own organization.');
    }
    return this.orgService.getOrganizationById(id);
  }
}
