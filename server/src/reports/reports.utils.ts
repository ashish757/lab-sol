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

    if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '') {
      const type = fieldTypeMap.get(fieldId) || 'number';
      
      const setCell = (colIdx: number, val: any) => {
        const cell = row.getCell(colIdx);
        if (type === 'number') {
          const num = parseFloat(val);
          cell.value = isNaN(num) ? null : num;
        } else if (type === 'date') {
          const dateObj = new Date(val);
          if (!isNaN(dateObj.getTime())) {
            cell.value = dateObj;
          } else {
            cell.value = val;
          }
        } else {
          cell.value = val;
        }
      };

      if (typeof rawVal === 'object' && 'onDate' in rawVal) {
        // It's a TimeMetric: write to columns D(4), E(5), F(6)
        setCell(4, rawVal.onDate);
        setCell(5, rawVal.toMonth);
        setCell(6, rawVal.toDate);
      } else {
        // Raw primitive value: write to column D(4)
        setCell(4, rawVal);
      }
    }
  }

  // 2. Brix / Pol chemical analysis field matching
  if (EXCEL_ROW_BRIX_POL[rowNum]) {
    const config = EXCEL_ROW_BRIX_POL[rowNum];
    const brixVal = data[config.brixKey];
    const polVal = data[config.polKey];

    const setBrixPolCell = (colIdx: number, val: any) => {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const num = parseFloat(val);
        row.getCell(colIdx).value = isNaN(num) ? null : num;
      }
    };

    if (typeof brixVal === 'object' && brixVal !== null && 'onDate' in brixVal) {
      setBrixPolCell(2, brixVal.onDate); // B: Brix onDate
      setBrixPolCell(4, brixVal.toMonth); // D: Brix toMonth
      setBrixPolCell(6, brixVal.toDate); // F: Brix toDate
    } else {
      setBrixPolCell(2, brixVal);
    }

    if (typeof polVal === 'object' && polVal !== null && 'onDate' in polVal) {
      setBrixPolCell(3, polVal.onDate); // C: Pol onDate
      setBrixPolCell(5, polVal.toMonth); // E: Pol toMonth
      setBrixPolCell(7, polVal.toDate); // G: Pol toDate
    } else {
      setBrixPolCell(3, polVal);
    }
  }
}
