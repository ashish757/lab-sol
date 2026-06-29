import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { apiRoutes } from '@shared/routes.config';

@Controller(apiRoutes.sessions.base)
@UseGuards(AuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('active/:unitId')
  async getActiveSession(@Param('unitId') unitId: string) {
    return this.sessionsService.getActiveSession(unitId);
  }

  @Post(apiRoutes.sessions.upsert)
  async upsertSessionData(@Body() body: any, @Request() req) {
    // The client will pass unitId and orgId in the body
    return this.sessionsService.upsertSessionData(
      body.unitId,
      body.orgId,
      body.payload,
      req.user
    );
  }

  @Post('lock/:id')
  async lockSessionData(@Param('id') id: string, @Request() req) {
    return this.sessionsService.lockSessionData(id, req.user);
  }
}
