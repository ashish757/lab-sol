import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { API_ROUTES } from '@shared/routes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(API_ROUTES.HEALTH.BASE)
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
