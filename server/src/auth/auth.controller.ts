import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SetupAccountDto } from './dto/setupAccount.dto';
import { SetupUserDto } from './dto/setupUser.dto';
import { ActivateStaffDto } from './dto/activateStaff.dto';
import { apiRoutes } from '@shared/routes.config';

@Controller(apiRoutes.auth.base)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Primary authentication endpoint for the closed-loop system.
   * Expects an email and master password payload, and delegates validation to the AuthService.
   */
  @Post(apiRoutes.auth.login)
  async login(@Body() loginCredentials: LoginDto) {
    return this.authService.login(loginCredentials);
  }

  @Post(apiRoutes.auth.setupAccount)
  async setupAccount(@Body() setupPayload: SetupAccountDto) {
    return this.authService.setupAccount(setupPayload);
  }

  @Post(apiRoutes.auth.setupUser)
  async setupUser(@Body() setupPayload: SetupUserDto) {
    return this.authService.setupUser(setupPayload);
  }

  @Get(apiRoutes.auth.invitePreview)
  async invitePreview(@Query('token') token: string) {
    return this.authService.invitePreview(token);
  }

  @Post(apiRoutes.auth.activateStaff)
  async activateStaff(@Body() activatePayload: ActivateStaffDto) {
    return this.authService.activateStaff(activatePayload);
  }
}
