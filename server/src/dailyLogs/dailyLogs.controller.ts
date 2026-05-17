import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DailyLogsService } from './dailyLogs.service';
import { UpsertDailyLogDto } from './dto/dailyLog.dto';

@Controller('api/daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) { }

  /**
   * POST /daily-logs
   * Submit a new daily analysis log entry.
   */
  @Post()
  create(@Body() dto: UpsertDailyLogDto) {
    return this.dailyLogsService.create(dto);
  }

  /**
   * GET /daily-logs
   * Fetch all logs, or filter by a specific date via ?date=YYYY-MM-DD
   */
  @Get()
  findAll(@Query('date') date?: string) {
    if (date) {
      return this.dailyLogsService.findByDate(date);
    }
    return this.dailyLogsService.findAll();
  }
}
