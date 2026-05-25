import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SetupAccountDto } from './dto/setupAccount.dto';
import { SetupUserDto } from './dto/setupUser.dto';
import { ActivateStaffDto } from './dto/activateStaff.dto';
import { MagicLinkService } from './magicLink.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly magicLinkService: MagicLinkService,
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
    // 1. Verify and consume the token safely via MagicLinkService
    const tokenRecord = await this.magicLinkService.verifyAndConsumeToken(setupPayload.token);

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

      // Note: MagicLinkService already marked the token as isUsed = true

      return { success: true, userId: user.id };
    });
  }

  async setupUser(setupPayload: SetupUserDto) {
    const tokenRecord = await this.magicLinkService.verifyAndConsumeToken(setupPayload.token);

    return this.prisma.$transaction(async (tx) => {
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

  async invitePreview(token: string) {
    return this.magicLinkService.previewTokenData(token);
  }

  async activateStaff(activatePayload: ActivateStaffDto) {
    const tokenRecord = await this.magicLinkService.verifyAndConsumeToken(activatePayload.token);

    return this.prisma.$transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(activatePayload.password, 10);
      const user = await tx.user.create({
        data: {
          email: tokenRecord.email,
          name: activatePayload.fullName,
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
}
