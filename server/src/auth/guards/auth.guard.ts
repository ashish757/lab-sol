import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const tok = this.extractTokenFromHeader(req);
    if (!tok) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(tok, {
        secret: process.env.JWT_SECRET || 'secret',
      });
      req['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, tok] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? tok : undefined;
  }
}
