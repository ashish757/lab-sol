import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/health")
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @Post("/analysis")
  saveAnalysis(@Body() data: any): { success: boolean } {
    return { success: true };
  }
}
