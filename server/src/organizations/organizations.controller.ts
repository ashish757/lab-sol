import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { InviteOrgDto } from './dto/inviteOrg.dto';
import { API_ROUTES } from '@shared/routes';

@Controller(API_ROUTES.ORGANIZATIONS.BASE)
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post(API_ROUTES.ORGANIZATIONS.INVITE)
  async invite(@Body() dto: InviteOrgDto) {
    return this.orgService.inviteOrganization(dto);
  }
}
