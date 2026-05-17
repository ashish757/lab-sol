import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import * as express from 'express';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /api/reports/daily/download
   * Streams a spreadsheet download of the daily report.
   */
  @Get('daily/download')
  async downloadDailyReport(@Res() res: express.Response): Promise<void> {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Daily_Report.xlsx"',
    );

    await this.reportsService.generateDailyReport(res);
  }
}
