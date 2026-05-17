import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { analysisConfig } from '../../../shared/analysisFields';
import { populateRow } from './reports.utils';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private fieldTypeMap: Map<string, 'number' | 'date' | 'time'> = new Map();

  private initializeFieldTypes() {
    if (this.fieldTypeMap.size > 0) return;
    for (const group of analysisConfig) {
      for (const field of group.fields) {
        this.fieldTypeMap.set(field.id, field.type);
      }
    }
  }

  /**
   * Reads the excel template and streams the spreadsheet directly to the response.
   */
  async generateDailyReport(res: express.Response): Promise<void> {
    const templatePath = path.join(process.cwd(), 'templates', 'daily_report_template.xlsx');

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Daily report template file not found at: ${templatePath}`);
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
  async generateDailyReportFromData(data: Record<string, any>): Promise<Buffer> {
    this.initializeFieldTypes();
    const templatePath = path.join(process.cwd(), 'templates', 'daily_report_template.xlsx');

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Daily report template file not found at: ${templatePath}`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const rawDataSheet = workbook.getWorksheet('rawData');
    if (!rawDataSheet) {
      throw new NotFoundException('rawData worksheet not found in the excel template.');
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
    const log = await this.prisma.dailyAnalysisLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new NotFoundException(`Daily analysis log with ID ${id} not found.`);
    }

    const metrics = typeof log.metrics === 'string' ? JSON.parse(log.metrics) : log.metrics;
    
    // Enrich with top-level date
    const data = {
      ...metrics,
      todayDate: log.logDate ? new Date(log.logDate).toISOString().split('T')[0] : metrics.todayDate,
    };

    return this.generateDailyReportFromData(data);
  }
}
