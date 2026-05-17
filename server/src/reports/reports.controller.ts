import { Controller, Get, Post, Body, Param, Res, NotFoundException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import * as express from 'express';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /api/reports/daily/download
   * Streams a blank template download of the daily report.
   */
  @Get('daily/download')
  async downloadDailyReportTemplate(@Res() res: express.Response): Promise<void> {
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
   * GET /api/reports/daily/download/:id
   * Streams a populated daily report spreadsheet by database ID.
   */
  @Get('daily/download/:id')
  async downloadDailyReport(@Param('id') id: string, @Res() res: express.Response): Promise<void> {
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

  /**
   * POST /api/reports/daily/preview
   * Streams a populated spreadsheet preview directly from raw client-sent JSON on-the-fly.
   */
  @Post('daily/preview')
  async previewDailyReport(@Body() payload: Record<string, any>, @Res() res: express.Response): Promise<void> {
    try {
      // Use metrics key if present in payload, or the full payload
      const data = payload.metrics ? payload.metrics : payload;

      const buffer = await this.reportsService.generateDailyReportFromData(data);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Daily_Report_Preview.xlsx"',
      );

      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error generating preview spreadsheet');
    }
  }
}
