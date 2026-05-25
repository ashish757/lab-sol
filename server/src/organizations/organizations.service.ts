import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteOrgDto } from './dto/inviteOrg.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  private readonly resend: Resend;

  constructor(private readonly prisma: PrismaService) {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
  }

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

      const rawRandomToken = randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(rawRandomToken, 10);

      const inviteTokenRecord = await tx.inviteToken.create({
        data: {
          tokenString: hashedToken,
          email: dto.contactEmail,
          role: Role.ORG_ADMIN,
          orgId: org.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return {
        success: true,
        message: 'Organization created and invite token generated successfully.',
        inviteToken: `${inviteTokenRecord.id}.${rawRandomToken}`,
        orgId: org.id,
      };
    });
  }

  async inviteUser(orgId: string, invitePayload: InviteUserDto) {
    if (invitePayload.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('You cannot invite Super Admins to an organization.');
    }

    if (invitePayload.role === 'UNIT_OPERATOR' && !invitePayload.unitId) {
      throw new BadRequestException('Unit operators must be assigned to a specific unit.');
    }

    if (invitePayload.unitId) {
      const unit = await this.prisma.unit.findUnique({ where: { id: invitePayload.unitId } });
      if (!unit || unit.orgId !== orgId) {
        throw new BadRequestException('Invalid unit ID for this organization.');
      }
    }

    const rawRandomToken = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(rawRandomToken, 10);

    const inviteTokenRecord = await this.prisma.inviteToken.create({
      data: {
        tokenString: hashedToken,
        email: invitePayload.email,
        role: invitePayload.role,
        orgId: orgId,
        unitId: invitePayload.unitId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return {
      success: true,
      message: 'User invited successfully.',
      inviteToken: `${inviteTokenRecord.id}.${rawRandomToken}`,
    };
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
