import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { analysisConfig, getAllFields } from '@shared/analysisFields';
import { populateRow } from './reports.utils';
import { DailyLogsService } from '../dailyLogs/dailyLogs.service';
import { UpsertDailyLogDto } from '../dailyLogs/dto/dailyLog.dto';
import { calculateReportData } from '../comman/calc/calculation';
import { requiredFormulaIds } from '../comman/calc/formulas';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dailyLogsService: DailyLogsService,
  ) {}

  private fieldTypeMap: Map<string, 'number' | 'date' | 'time' | 'text'> =
    new Map();

  private initializeFieldTypes() {
    if (this.fieldTypeMap.size > 0) return;
    for (const field of getAllFields(analysisConfig)) {
      this.fieldTypeMap.set(field.id, field.type);
    }
  }

  /**
   * Reads the excel template and streams the spreadsheet directly to the response.
   */
  async generateDailyReport(res: express.Response): Promise<void> {
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'daily_report_template.xlsx',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(
        `Daily report template file not found at: ${templatePath}`,
      );
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // Stream workbook directly to express response object
    await workbook.xlsx.write(res);
    res.end();
  }

  /**
   * Generates a populated Excel workbook in-memory buffer using the raw data metrics.
   */
  async generateDailyReportFromData(
    data: Record<string, any>,
  ): Promise<Buffer> {
    this.initializeFieldTypes();
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'daily_report_template.xlsx',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(
        `Daily report template file not found at: ${templatePath}`,
      );
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const rawDataSheet = workbook.getWorksheet('rawData');
    if (!rawDataSheet) {
      throw new NotFoundException(
        'rawData worksheet not found in the excel template.',
      );
    }

    // Populate data row by row using our modular utility function
    for (let rowNum = 1; rowNum <= rawDataSheet.rowCount; rowNum++) {
      const row = rawDataSheet.getRow(rowNum);
      populateRow(rowNum, row, data, this.fieldTypeMap);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as any);
  }

  /**
   * Fetches a database daily log record and returns a populated Excel buffer.
   */
  async generateDailyReportById(id: string): Promise<Buffer> {
    const log = await this.prisma.dailyLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new NotFoundException(
        `Daily analysis log with ID ${id} not found.`,
      );
    }

    const metrics = (
      typeof log.payload === 'string' ? JSON.parse(log.payload) : log.payload
    ) as Record<string, any>;

    // Enrich with top-level date
    const data: Record<string, any> = Object.assign({}, metrics);
    data.todayDate = log.date
      ? new Date(log.date).toISOString().split('T')[0]
      : (metrics.todayDate as string | undefined);

    return this.generateDailyReportFromData(data);
  }

  async saveAndGenerateReport(
    dto: UpsertDailyLogDto,
    res: express.Response,
    user: any,
  ): Promise<void> {
    let savedLog;
    try {
      savedLog = await this.dailyLogsService.upsertLog(user.unitId, user.orgId, dto);
    } catch (error) {
      if (error instanceof ForbiddenException && error.message === 'Log is locked and cannot be edited') {
        const requestedDate = new Date(dto.date);
        savedLog = await this.prisma.dailyLog.findUnique({
          where: { unitId_date: { unitId: user.unitId, date: requestedDate } },
        });
        if (!savedLog) throw new NotFoundException('Log not found');
      } else {
        throw error;
      }
    }
    const metrics = (
      typeof savedLog.payload === 'string'
        ? JSON.parse(savedLog.payload)
        : savedLog.payload
    ) as Record<string, any>;

    const data: Record<string, any> = Object.assign({}, metrics);
    data.todayDate = savedLog.date
      ? new Date(savedLog.date).toISOString().split('T')[0]
      : (metrics.todayDate as string | undefined);

    const calculatedData = calculateReportData(data, requiredFormulaIds);
    const buffer = await this.generateDailyReportFromData(calculatedData);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Daily_Report_${savedLog.id}.xlsx"`,
    );
    res.send(buffer);
  }
}
