import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';

@Injectable()
export class ReportsService {
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
}
