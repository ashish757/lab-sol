import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { DailyLogsService } from './dailyLogs.service';
import { InsertDailyLogDto } from './dto/dailyLog.dto';
import { API_ROUTES } from '@shared/routes';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(API_ROUTES.DAILY_LOGS.BASE)
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  /**
   * POST /daily-logs
   * Submit a new daily analysis log entry.
   */
  @Post(API_ROUTES.DAILY_LOGS.CREATE)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.UNIT_OPERATOR)
  create(@Body() dto: InsertDailyLogDto, @Req() request: any) {
    const currentUser = request.user;
    // Inject the user's unitId and orgId into the payload if they are an operator, etc.
    return this.dailyLogsService.create(dto, currentUser);
  }

  /**
   * GET /daily-logs
   * Fetch all logs, or filter by a specific date via ?date=YYYY-MM-DD
   */
  @Get(API_ROUTES.DAILY_LOGS.GET_ALL)
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
  @Get(API_ROUTES.DAILY_LOGS.GET_ONE)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, Role.ORG_STAFF, Role.UNIT_OPERATOR)
  findOne(@Param('id') id: string, @Req() request: any) {
    const currentUser = request.user;
    return this.dailyLogsService.findOne(id, currentUser);
  }
}
