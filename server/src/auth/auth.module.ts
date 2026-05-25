import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MagicLinkService } from './magicLink.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MagicLinkService],
  exports: [MagicLinkService],
})
export class AuthModule {}
