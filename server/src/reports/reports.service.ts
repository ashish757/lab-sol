import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { analysisConfig, getAllFields, InputType } from '@shared/analysisFields';
import { populateRow } from './reports.utils';
import { DailyLogsService } from '../dailyLogs/dailyLogs.service';
import { UpsertDailyLogDto } from '../dailyLogs/dto/dailyLog.dto';
import { CalculationsService } from '../calculations/calculations.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dailyLogsService: DailyLogsService,
    private readonly calculationsService: CalculationsService,
  ) {}

  private fieldTypeMap: Map<string, InputType> = new Map();

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
    data.todayDate = log.createdAt
      ? new Date(log.createdAt).toISOString().split('T')[0]
      : (metrics.todayDate as string | undefined);

    this.logger.log(`Generating daily report Excel for log ID: ${id}`);
    return this.generateDailyReportFromData(data);
  }

  async saveAndGenerateReport(
    dto: UpsertDailyLogDto,
    res: express.Response,
    user: any,
  ): Promise<void> {
    let savedLog;
    try {
      savedLog = await this.dailyLogsService.upsertLog(user.unitId, user.orgId, user, dto);
    } catch (error) {
      if (error instanceof ForbiddenException && error.message === 'Log is locked and cannot be edited') {
        const requestedDate = new Date(dto.createdAt);
        savedLog = await this.prisma.dailyLog.findUnique({
          where: { unitId_createdAt: { unitId: user.unitId, createdAt: requestedDate } },
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
    data.todayDate = savedLog.createdAt
      ? new Date(savedLog.createdAt).toISOString().split('T')[0]
      : (metrics.todayDate as string | undefined);

    const calculatedData = {
      ...data,
      ...this.calculationsService.evaluateFormulas(data)
    };
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

  /**
   * Generates a multi-column Excel file from a JSON object (handles TimeMetric).
   */
  async generateMultiColumnReport(data: Record<string, any>): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Calculations');
    
    // Create label mapping from shared config
    const labelMap = new Map<string, string>();
    getAllFields(analysisConfig).forEach(field => {
      labelMap.set(field.id, field.label);
    });

    // Define columns
    sheet.columns = [
      { header: 'Metric ID', key: 'metricId', width: 30 },
      { header: 'Metric Name', key: 'metricName', width: 40 },
      { header: 'On Date', key: 'onDate', width: 20 },
      { header: 'To Month', key: 'toMonth', width: 20 },
      { header: 'To Date', key: 'toDate', width: 20 }
    ];
    
    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    for (const [key, value] of Object.entries(data)) {
      const metricName = labelMap.get(key) || key;

      if (typeof value === 'object' && value !== null && 'onDate' in value) {
        sheet.addRow({
          metricId: key,
          metricName: metricName,
          onDate: value.onDate,
          toMonth: value.toMonth,
          toDate: value.toDate
        });
      } else if (typeof value === 'object' && value !== null) {
        sheet.addRow({ 
          metricId: key, 
          metricName: metricName, 
          onDate: JSON.stringify(value) 
        });
      } else {
        sheet.addRow({ 
          metricId: key, 
          metricName: metricName, 
          onDate: value 
        });
      }
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as any);
  }

  /**
   * Fetches pre-calculated metrics from DailyCalculation and generates a simple Excel.
   */
  async generateCalculatedExcelById(id: string): Promise<Buffer> {
    const calculation = await this.prisma.dailyCalculation.findUnique({
      where: { dailyLogId: id },
    });

    if (!calculation) {
      throw new NotFoundException(`Calculation record not found for log ID ${id}. Please make sure the log is saved first.`);
    }

    const calculatedMetrics = typeof calculation.calculatedMetrics === 'string' 
      ? JSON.parse(calculation.calculatedMetrics) 
      : calculation.calculatedMetrics;

    this.logger.log(`Generating calculated Excel report for log ID: ${id}`);
    return this.generateMultiColumnReport(calculatedMetrics as Record<string, any>);
  }
}
