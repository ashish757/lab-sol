import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MagicLinkService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a random secure token, hashes it with bcrypt, saves it to the DB,
   * and returns the `{tokenId}.{rawRandomToken}` string.
   */
  async generateAndSaveToken(params: {
    email: string;
    orgId: string;
    role: Role;
    unitId?: string;
  }) {
    const rawRandomToken = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(rawRandomToken, 10);

    const inviteTokenRecord = await this.prisma.inviteToken.create({
      data: {
        tokenString: hashedToken,
        email: params.email,
        role: params.role,
        orgId: params.orgId,
        unitId: params.unitId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return `${inviteTokenRecord.id}.${rawRandomToken}`;
  }

  /**
   * Validates the raw concatenated token string.
   * Throws UnauthorizedException if invalid, expired, or already used.
   * On success, marks the token as used and returns its data.
   */
  async verifyAndConsumeToken(token: string) {
    const [tokenId, rawRandomToken] = token.split('.');

    if (!tokenId || !rawRandomToken) {
      throw new UnauthorizedException('Malformed invite token.');
    }

    const tokenRecord = await this.prisma.inviteToken.findUnique({
      where: { id: tokenId },
    });

    if (!tokenRecord || tokenRecord.isUsed) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired.');
    }

    const isTokenValid = await bcrypt.compare(rawRandomToken, tokenRecord.tokenString);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    // Mark as used
    await this.prisma.inviteToken.update({
      where: { id: tokenRecord.id },
      data: { isUsed: true },
    });

    return tokenRecord;
  }

  /**
   * Validates the token without consuming it, to safely return preview data.
   */
  async previewTokenData(token: string) {
    const [tokenId, rawRandomToken] = token.split('.');

    if (!tokenId || !rawRandomToken) {
      throw new UnauthorizedException('Malformed invite token.');
    }

    const tokenRecord = await this.prisma.inviteToken.findUnique({
      where: { id: tokenId },
    });

    if (!tokenRecord || tokenRecord.isUsed) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired.');
    }

    const isTokenValid = await bcrypt.compare(rawRandomToken, tokenRecord.tokenString);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: tokenRecord.orgId },
    });

    let unitName: string | null = null;
    if (tokenRecord.unitId) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: tokenRecord.unitId },
      });
      if (unit) unitName = unit.name;
    }

    return {
      orgName: org?.name,
      orgId: tokenRecord.orgId,
      unitName,
      unitId: tokenRecord.unitId,
      email: tokenRecord.email,
      role: tokenRecord.role,
    };
  }
}
