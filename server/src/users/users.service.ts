import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteStaffDto } from './dto/inviteStaff.dto';
import { MagicLinkService } from '../auth/magicLink.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly magicLinkService: MagicLinkService,
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

    const rawToken = await this.magicLinkService.generateAndSaveToken({
      email: invitePayload.email,
      role: invitePayload.role,
      orgId: orgId,
      unitId: invitePayload.unitId,
    });

    return {
      success: true,
      message: 'User invited successfully.',
      inviteToken: rawToken,
    };
  }
}
