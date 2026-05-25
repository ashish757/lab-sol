import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ReportsService } from './reports.service';
import * as express from 'express';
import { apiRoutes } from '@shared/routes.config';
import { UpsertDailyLogDto } from '../dailyLogs/dto/dailyLog.dto';

@Controller(apiRoutes.reports.base)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /api/reports/daily-logs/download
   * Streams a blank template download of the daily report.
   */
  @Get(apiRoutes.reports.downloadTemplate)
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
  @Get(apiRoutes.reports.downloadOne)
  @UseGuards(AuthGuard)
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

  @Post(apiRoutes.reports.saveAndGenerate)
  @UseGuards(AuthGuard)
  async saveAndGenerateReport(
    @Body() dto: UpsertDailyLogDto,
    @Res() res: express.Response,
    @Req() req: any,
  ): Promise<void> {
    try {
      await this.reportsService.saveAndGenerateReport(dto, res, req.user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send('Internal server error generating and saving spreadsheet');
    }
  }
}
