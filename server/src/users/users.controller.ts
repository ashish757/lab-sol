import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { InviteStaffDto } from './dto/inviteStaff.dto';
import { apiRoutes } from '@shared/routes.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(apiRoutes.users.base)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(apiRoutes.users.invite)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ORG_ADMIN)
  async inviteUser(
    @Body() invitePayload: InviteStaffDto,
    @Req() request: any,
  ) {
    const orgId = request.user.orgId;
    return this.usersService.inviteUser(orgId, invitePayload);
  }
}
