import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/calculations')
@UseGuards(AuthGuard)
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post('evaluate')
  evaluatePayload(@Body() payload: Record<string, any>) {
    return this.calculationsService.evaluateFormulas(payload);
  }
}
