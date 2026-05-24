import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

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
      },
    };
  }
}
