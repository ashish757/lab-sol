import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteOrgDto } from './dto/inviteOrg.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';
import { MagicLinkService } from '../auth/magicLink.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly magicLinkService: MagicLinkService,
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
        email: dto.contactEmail,
        orgId: org.id,
        role: Role.ORG_ADMIN,
      });

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
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        units: true,
        users: {
          select: { id: true, email: true, role: true },
        },
      },
    });
  }
}
