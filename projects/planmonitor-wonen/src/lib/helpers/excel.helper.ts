import type { Worksheet } from 'exceljs';

export class ExcelHelper {

  public static async getNewWorkbook() {
    const excelJS = await import('exceljs');
    if (excelJS.Workbook) {
      return new excelJS.Workbook();
    }
    if (excelJS.default && excelJS.default.Workbook) {
      return new excelJS.default.Workbook();
    }
    throw new Error('Could not load ExcelJS Workbook');
  }

  public static getColumnLetter(worksheet: Worksheet, yearColumnIndex: number) {
    return worksheet.getColumn(yearColumnIndex).letter;
  }

}
