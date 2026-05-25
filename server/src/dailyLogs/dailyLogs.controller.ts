import { Body, Controller, Get, Param, Post, Put, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { DailyLogsService } from './dailyLogs.service';
import { UpsertDailyLogDto } from './dto/dailyLog.dto';
import { apiRoutes } from '@shared/routes.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(apiRoutes.dailyLogs.base)
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  // --- New Endpoints as per requirements ---

  /**
   * GET /api/daily-logs/unit/:unitId
   * Added to shared routes by standard pattern if not strictly defined, or just use current path.
   */
  @Get('unit/:unitId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.ORG_STAFF, Role.UNIT_OPERATOR)
  getLogsForUnit(@Param('unitId') unitId: string) {
    return this.dailyLogsService.getLogsForUnit(unitId);
  }

  /**
   * PUT /api/daily-logs/unit/:unitId/upsert
   */
  @Put('unit/:unitId/upsert')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.UNIT_OPERATOR, Role.ORG_ADMIN)
  upsertLog(
    @Param('unitId') unitId: string,
    @Body() dto: UpsertDailyLogDto,
    @Req() request: any
  ) {
    const currentUser = request.user;
    // ensure currentUser has access to this unitId handled in guards/service normally, 
    // but we use their orgId
    return this.dailyLogsService.upsertLog(unitId, currentUser.orgId, dto);
  }

  /**
   * PATCH /api/daily-logs/:logId/lock
   */
  @Patch(':logId/lock')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.UNIT_OPERATOR, Role.ORG_ADMIN)
  lockLog(
    @Param('logId') logId: string,
    @Req() request: any
  ) {
    const currentUser = request.user;
    return this.dailyLogsService.lockLog(logId, currentUser.unitId);
  }

  // --- Adapted Legacy Endpoints ---

  /**
   * POST /daily-logs
   * Submit a new daily analysis log entry (legacy support).
   */
  @Post(apiRoutes.dailyLogs.create)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.UNIT_OPERATOR)
  create(@Body() dto: UpsertDailyLogDto, @Req() request: any) {
    const currentUser = request.user;
    return this.dailyLogsService.upsertLog(currentUser.unitId, currentUser.orgId, dto);
  }

  /**
   * GET /daily-logs
   * Fetch all logs, or filter by a specific date via ?date=YYYY-MM-DD
   */
  @Get(apiRoutes.dailyLogs.getAll)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.ORG_STAFF, Role.UNIT_OPERATOR)
  findAll(@Query('date') date: string | undefined, @Req() request: any) {
    const currentUser = request.user;
    if (date) {
      return this.dailyLogsService.findByDate(date, currentUser);
    }
    return this.dailyLogsService.findAll(currentUser);
  }

  /**
   * GET /daily-logs/:id
   * Fetch a single daily log by UUID.
   */
  @Get(apiRoutes.dailyLogs.getOne)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.ORG_STAFF, Role.UNIT_OPERATOR)
  findOne(@Param('id') id: string, @Req() request: any) {
    const currentUser = request.user;
    return this.dailyLogsService.findOne(id, currentUser);
  }
}
