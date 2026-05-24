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

  async login(dto: LoginDto) {
    const usr = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!usr) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(dto.password, usr.password || '');
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: usr.id,
      email: usr.email,
      role: usr.role,
      orgId: usr.orgId,
      unitId: usr.unitId,
    };
    const tok = await this.jwtService.signAsync(payload);
    return {
      token: tok,
      user: {
        id: usr.id,
        email: usr.email,
        role: usr.role,
      },
    };
  }
}
