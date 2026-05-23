import * as ExcelJS from 'exceljs';
import {
  EXCEL_ROW_SINGLE_VALUES,
  EXCEL_ROW_BRIX_POL,
} from '@shared/excelMapping';

/**
 * Standard utility function to populate a worksheet row's columns based on
 * the row number, raw JSON metrics, and a field type map.
 */
export function populateRow(
  rowNum: number,
  row: ExcelJS.Row,
  data: Record<string, any>,
  fieldTypeMap: Map<string, 'number' | 'date' | 'time' | 'text'>,
): void {
  // 1. Single value field matching
  if (EXCEL_ROW_SINGLE_VALUES[rowNum]) {
    const fieldId = EXCEL_ROW_SINGLE_VALUES[rowNum];
    const rawVal = data[fieldId];

    if (
      rawVal !== undefined &&
      rawVal !== null &&
      String(rawVal).trim() !== ''
    ) {
      const type = fieldTypeMap.get(fieldId) || 'number';
      const cell = row.getCell(4); // Column D (value)

      if (type === 'number') {
        const num = parseFloat(rawVal);
        cell.value = isNaN(num) ? null : num;
      } else if (type === 'date') {
        const dateObj = new Date(rawVal);
        if (!isNaN(dateObj.getTime())) {
          cell.value = dateObj;
        } else {
          cell.value = rawVal;
        }
      } else {
        cell.value = rawVal;
      }
    }
  }

  // 2. Brix / Pol chemical analysis field matching
  if (EXCEL_ROW_BRIX_POL[rowNum]) {
    const config = EXCEL_ROW_BRIX_POL[rowNum];
    const brixVal = data[config.brixKey];
    const polVal = data[config.polKey];

    if (
      brixVal !== undefined &&
      brixVal !== null &&
      String(brixVal).trim() !== ''
    ) {
      const brixNum = parseFloat(brixVal);
      row.getCell(2).value = isNaN(brixNum) ? null : brixNum; // Column B (Brix)
    }

    if (
      polVal !== undefined &&
      polVal !== null &&
      String(polVal).trim() !== ''
    ) {
      const polNum = parseFloat(polVal);
      row.getCell(3).value = isNaN(polNum) ? null : polNum; // Column C (Pol)
    }
  }
}
