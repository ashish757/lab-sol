import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SetupAccountDto } from './dto/setupAccount.dto';
import { SetupUserDto } from './dto/setupUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user based on their login credentials.
   * Compares the hashed password using bcrypt and generates a robust JWT payload.
   */
  async login(loginCredentials: LoginDto) {
    // 1. Fetch the user record from the database using the provided email.
    const existingUserRecord = await this.prisma.user.findUnique({
      where: { email: loginCredentials.email },
    });

    if (!existingUserRecord) {
      throw new UnauthorizedException('Invalid authentication credentials.');
    }

    // 2. Securely compare the provided plaintext password against the stored bcrypt hash.
    const isPasswordMatching = await bcrypt.compare(loginCredentials.password, existingUserRecord.password || '');
    
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid authentication credentials.');
    }

    // 3. Construct a standard JWT payload containing all vital Role-Based Access Control identifiers.
    const authenticationPayload = {
      sub: existingUserRecord.id,
      email: existingUserRecord.email,
      role: existingUserRecord.role,
      orgId: existingUserRecord.orgId,
      unitId: existingUserRecord.unitId,
    };

    // 4. Sign the payload using the injected JwtService.
    const authenticationToken = await this.jwtService.signAsync(authenticationPayload);
    
    return {
      token: authenticationToken,
      user: {
        id: existingUserRecord.id,
        email: existingUserRecord.email,
        role: existingUserRecord.role,
        orgId: existingUserRecord.orgId,
        unitId: existingUserRecord.unitId,
      },
    };
  }

  async setupAccount(setupPayload: SetupAccountDto) {
    const [tokenId, rawRandomToken] = setupPayload.token.split('.');

    if (!tokenId || !rawRandomToken) {
      throw new UnauthorizedException('Malformed invite token.');
    }

    const tokenRecord = await this.prisma.inviteToken.findUnique({
      where: { id: tokenId },
    });

    if (!tokenRecord || tokenRecord.isUsed) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const isTokenValid = await bcrypt.compare(rawRandomToken, tokenRecord.tokenString);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Transaction Step 1: Update the Organization record
      await tx.organization.update({
        where: { id: tokenRecord.orgId },
        data: { name: setupPayload.updatedOrgName, status: 'ACTIVE' },
      });

      // Transaction Step 2: Hash the password and Create the User record
      const hashedPassword = await bcrypt.hash(setupPayload.password, 10);
      const user = await tx.user.create({
        data: {
          email: tokenRecord.email,
          name: setupPayload.adminName,
          password: hashedPassword,
          role: 'ORG_ADMIN',
          orgId: tokenRecord.orgId,
          status: 'ACTIVE',
        },
      });

      // Transaction Step 3: Mark the InviteToken as used
      await tx.inviteToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      });

      return { success: true, userId: user.id };
    });
  }

  async setupUser(setupPayload: SetupUserDto) {
    const [tokenId, rawRandomToken] = setupPayload.token.split('.');

    if (!tokenId || !rawRandomToken) {
      throw new UnauthorizedException('Malformed invite token.');
    }

    const tokenRecord = await this.prisma.inviteToken.findUnique({
      where: { id: tokenId },
    });

    if (!tokenRecord || tokenRecord.isUsed) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const isTokenValid = await bcrypt.compare(rawRandomToken, tokenRecord.tokenString);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Mark token as used
      await tx.inviteToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      });

      // Create User
      const hashedPassword = await bcrypt.hash(setupPayload.password, 10);
      const user = await tx.user.create({
        data: {
          email: tokenRecord.email,
          name: setupPayload.name,
          password: hashedPassword,
          role: tokenRecord.role,
          orgId: tokenRecord.orgId,
          unitId: tokenRecord.unitId,
          status: 'ACTIVE',
        },
      });

      return { success: true, userId: user.id };
    });
  }

  async getTokenDetails(token: string) {
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

    const isTokenValid = await bcrypt.compare(rawRandomToken, tokenRecord.tokenString);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired.');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: tokenRecord.orgId },
    });

    let unit: { id: string; orgId: string; name: string; } | null = null;
    if (tokenRecord.unitId) {
      unit = await this.prisma.unit.findUnique({
        where: { id: tokenRecord.unitId },
      });
    }

    return {
      email: tokenRecord.email,
      role: tokenRecord.role,
      orgId: tokenRecord.orgId,
      orgName: org?.name,
      unitId: tokenRecord.unitId,
      unitName: unit?.name,
    };
  }
}
