import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteStaffDto } from './dto/inviteStaff.dto';
import { MagicLinkService } from '../auth/magicLink.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly magicLinkService: MagicLinkService,
    private readonly mailService: MailService,
  ) {}

  async inviteUser(orgId: string, invitePayload: InviteStaffDto) {
    if (invitePayload.role === 'UNIT_OPERATOR' && !invitePayload.unitId) {
      throw new BadRequestException('Unit operators must be assigned to a specific unit.');
    }

    if (invitePayload.unitId) {
      const unit = await this.prisma.unit.findUnique({ where: { id: invitePayload.unitId } });
      if (!unit || unit.orgId !== orgId) {
        throw new BadRequestException('Invalid unit ID for this organization.');
      }
    }

    let orgName = 'Your Organization';
    const org = await this.prisma.organization.findUnique({ where: { id: orgId } });
    if (org) orgName = org.name;

    const rawToken = await this.magicLinkService.generateAndSaveToken({
      email: invitePayload.email,
      role: invitePayload.role,
      orgId: orgId,
      unitId: invitePayload.unitId,
    });

    await this.mailService.sendStaffInvite(invitePayload.email, orgName, invitePayload.role, rawToken);

    return {
      success: true,
      message: 'User invited successfully.',
      inviteToken: rawToken,
    };
  }
}
