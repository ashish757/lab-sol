import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SetupOrgDto } from './dto/setupOrg.dto';
import { SetupUserDto } from './dto/setupUser.dto';
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

  @Post(API_ROUTES.AUTH.SETUP_ORG)
  async setupOrg(@Body() dto: SetupOrgDto) {
    return this.authService.setupOrg(dto);
  }

  @Post(API_ROUTES.AUTH.SETUP_USER)
  async setupUser(@Body() dto: SetupUserDto) {
    return this.authService.setupUser(dto);
  }

  @Get(API_ROUTES.AUTH.GET_TOKEN)
  async getTokenDetails(@Param('token') token: string) {
    return this.authService.getTokenDetails(token);
  }
}
