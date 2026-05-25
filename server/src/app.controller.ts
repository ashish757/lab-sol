import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { apiRoutes } from '@shared/routes.config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(apiRoutes.health.base)
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
