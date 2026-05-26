import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteStaffDto } from './dto/inviteStaff.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
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

  async cancelUserInvite(tokenId: string) {
    const token = await this.prisma.inviteToken.findUnique({ where: { id: tokenId } });
    if (!token) throw new BadRequestException('Invite token not found');
    if (token.isUsed) throw new BadRequestException('Cannot cancel an already used invite');

    await this.prisma.inviteToken.delete({ where: { id: tokenId } });

    return { success: true, message: 'User invite cancelled' };
  }

  async updateUser(targetUserId: string, requesterId: string, orgId: string, dto: UpdateUserDto) {
    if (targetUserId === requesterId) {
      throw new ForbiddenException('You cannot modify your own account roles or assignments');
    }

    const usr = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!usr || usr.orgId !== orgId) {
      throw new NotFoundException('User not found in your organization');
    }

    if (dto.unitId) {
      const unt = await this.prisma.unit.findUnique({ where: { id: dto.unitId } });
      if (!unt || unt.orgId !== orgId) {
        throw new BadRequestException('Unit not found in your organization');
      }
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        role: dto.role,
        unitId: dto.unitId,
        status: dto.status,
      },
    });
  }
}
