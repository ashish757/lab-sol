import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { API_ROUTES } from '@shared/routes';

@Controller(API_ROUTES.AUTH.BASE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Primary authentication endpoint for the closed-loop system.
   * Expects an email and master password payload, and delegates validation to the AuthService.
   */
  @Post(API_ROUTES.AUTH.LOGIN)
  async login(@Body() loginCredentials: LoginDto) {
    return this.authService.login(loginCredentials);
  }
}
