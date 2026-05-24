import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { API_ROUTES } from '@shared/routes';

@Controller(API_ROUTES.AUTH.BASE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(API_ROUTES.AUTH.LOGIN)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
