import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteOrgDto } from './dto/inviteOrg.dto';
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
    const { orgName, contactEmail } = dto;

    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: orgName,
        },
      });

      const tok = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await tx.inviteToken.create({
        data: {
          tokenString: tok,
          email: contactEmail,
          role: Role.ORG_ADMIN,
          orgId: org.id,
          expiresAt,
        },
      });

      const inviteLink = `http://localhost:3000/setup-account?token=${tok}`;

      try {
        await this.resend.emails.send({
          from: 'onboarding@resend.dev',
          to: contactEmail,
          subject: 'Organization Setup Invitation',
          html: `<p>Click here to setup: <a href="${inviteLink}">${inviteLink}</a></p>`,
        });
      } catch (err) {
        console.error(err);
      }

      return { success: true, orgId: org.id };
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
