import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteOrgDto } from './dto/inviteOrg.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';
import { MagicLinkService } from '../auth/magicLink.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly magicLinkService: MagicLinkService,
    private readonly mailService: MailService,
  ) {}

  async inviteOrganization(dto: InviteOrgDto) {
    const generatedOrgId = dto.orgId || uuidv4();

    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.upsert({
        where: { id: generatedOrgId },
        update: {},
        create: {
          id: generatedOrgId,
          name: dto.orgName,
          status: 'INACTIVE',
        },
      });

      // MagicLinkService handles the crypto, bcrypt, and DB save
      const rawToken = await this.magicLinkService.generateAndSaveToken({
        email: dto.email,
        orgId: org.id,
        role: Role.ORG_ADMIN,
      });

      await this.mailService.sendOrgAdminInvite(dto.email, dto.orgName, rawToken);

      this.logger.log(`Organization invite generated for ${dto.orgName} (ID: ${org.id}) and sent to ${dto.email}`);

      return {
        success: true,
        message: 'Organization created and invite token generated successfully.',
        inviteToken: rawToken,
        orgId: org.id,
      };
    });
  }

  async getAllOrganizations() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: { units: true, users: true },
        },
      },
    });
  }

  async getOrganizationById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        units: true,
        users: {
          select: { 
            id: true, 
            email: true, 
            role: true, 
            status: true,
            unitId: true,
            unit: { select: { name: true } }
          },
        },
      },
    });

    if (!org) return null;

    const pendingInvites = await this.prisma.inviteToken.findMany({
      where: { orgId: id, isUsed: false },
    });

    return { ...org, pendingInvites };
  }

  async cancelOrganizationInvite(id: string) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) {
      this.logger.warn(`Failed to cancel org invite ${id}: Organization not found`);
      throw new BadRequestException('Organization not found');
    }
    if (org.status !== 'INACTIVE') {
      this.logger.warn(`Failed to cancel org invite ${id}: Organization is active`);
      throw new BadRequestException('Cannot cancel an active organization');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.inviteToken.deleteMany({ where: { orgId: id } });
      await tx.organization.delete({ where: { id } });
      
      this.logger.log(`Successfully cancelled invite and deleted inactive organization ${id}`);
      
      return { success: true, message: 'Organization invite cancelled' };
    });
  }
}
