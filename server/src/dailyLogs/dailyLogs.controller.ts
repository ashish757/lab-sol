import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DailyLogsService } from './dailyLogs.service';
import { InsertDailyLogDto } from './dto/dailyLog.dto';
import { API_ROUTES } from '@shared/routes';

@Controller(API_ROUTES.DAILY_LOGS.BASE)
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  /**
   * POST /daily-logs
   * Submit a new daily analysis log entry.
   */
  @Post(API_ROUTES.DAILY_LOGS.CREATE)
  create(@Body() dto: InsertDailyLogDto) {
    return this.dailyLogsService.create(dto);
  }

  /**
   * GET /daily-logs
   * Fetch all logs, or filter by a specific date via ?date=YYYY-MM-DD
   */
  @Get(API_ROUTES.DAILY_LOGS.GET_ALL)
  findAll(@Query('date') date?: string) {
    if (date) {
      return this.dailyLogsService.findByDate(date);
    }
    return this.dailyLogsService.findAll();
  }

  /**
   * GET /daily-logs/:id
   * Fetch a single daily log by UUID.
   */
  @Get(API_ROUTES.DAILY_LOGS.GET_ONE)
  findOne(@Param('id') id: string) {
    return this.dailyLogsService.findOne(id);
  }
}
