import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import * as express from 'express';
import { API_ROUTES } from '@shared/routes';
import { InsertDailyLogDto } from '../dailyLogs/dto/dailyLog.dto';

@Controller(API_ROUTES.REPORTS.BASE)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /api/reports/daily-logs/download
   * Streams a blank template download of the daily report.
   */
  @Get(API_ROUTES.REPORTS.DOWNLOAD_TEMPLATE)
  async downloadDailyReportTemplate(
    @Res() res: express.Response,
  ): Promise<void> {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Daily_Report_Template.xlsx"',
    );

    await this.reportsService.generateDailyReport(res);
  }

  /**
   * GET /api/reports/daily-logs/download/:id
   * Streams a populated daily report spreadsheet by database ID.
   */
  @Get(API_ROUTES.REPORTS.DOWNLOAD_ONE)
  async downloadDailyReport(
    @Param('id') id: string,
    @Res() res: express.Response,
  ): Promise<void> {
    try {
      const buffer = await this.reportsService.generateDailyReportById(id);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Daily_Report_${id}.xlsx"`,
      );

      res.send(buffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).send(error.message);
      } else {
        console.error(error);
        res.status(500).send('Internal server error generating spreadsheet');
      }
    }
  }

  @Post(API_ROUTES.REPORTS.SAVE_AND_GENERATE)
  async saveAndGenerateReport(
    @Body() dto: InsertDailyLogDto,
    @Res() res: express.Response,
  ): Promise<void> {
    try {
      await this.reportsService.saveAndGenerateReport(dto, res);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send('Internal server error generating and saving spreadsheet');
    }
  }
}
