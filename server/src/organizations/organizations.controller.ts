import { Body, Controller, Get, Param, Post, UseGuards, Req, ForbiddenException, ParseUUIDPipe } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { InviteOrgDto } from './dto/inviteOrg.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { apiRoutes } from '@shared/routes.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(apiRoutes.organizations.base)
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post(apiRoutes.organizations.inviteOrg)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async invite(@Body() invitePayload: InviteOrgDto) {
    return this.orgService.inviteOrganization(invitePayload);
  }

  @Post(apiRoutes.organizations.inviteUser)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ORG_ADMIN)
  async inviteUser(
    @Param('id', ParseUUIDPipe) orgId: string,
    @Body() invitePayload: InviteUserDto,
    @Req() request: any,
  ) {
    if (request.user.orgId !== orgId) {
      throw new ForbiddenException('You can only invite users to your own organization.');
    }
    return this.orgService.inviteUser(orgId, invitePayload);
  }

  @Get(apiRoutes.organizations.getAll)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAllOrganizations() {
    return this.orgService.getAllOrganizations();
  }

  @Get(apiRoutes.organizations.getOne)
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
