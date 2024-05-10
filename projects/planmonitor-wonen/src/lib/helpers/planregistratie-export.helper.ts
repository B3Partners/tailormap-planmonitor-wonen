import * as ExcelJS from 'exceljs';
import { PlancategorieHelper } from './plancategorie.helper';
import { FileHelper } from '@tailormap-viewer/shared';
import { CategorieTableRowModel } from '../models/categorie-table-row.model';

const GREY_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FFD9D9D8' } };
const ORANGE_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FFDB803D' } };
const BLUE_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FF689BD2' } };
const PINK_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FFE041FB' } };
const YELLOW_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FFFFFC44' } };
const GREEN_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FF84A951' } };
const DARK_YELLOW_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FFF6BF34' } };

export class PlanregistratieExportHelper {

  public static createExcelExport(
    plannaam: string,
    table: CategorieTableRowModel[],
  ) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(plannaam);
    sheet.pageSetup.paperSize = 9;
    sheet.columns = PlancategorieHelper.categorieColumns.map(key => {
      // width = character width + "magic" 5/7 to fix character width -> px conversion, see https://github.com/exceljs/exceljs/issues/744#issuecomment-1529795663
      const columnConfig: Map<string, { label: string; width: number }> = new Map([
        [ 'label', { label: '', width: 24.71 }],
        [ 'groeplabel', { label: 'Groepnaam', width: 24.71 }],
        [ 'totalen', { label: 'Totalen', width: 14.71 }],
        [ 'total_check', { label: 'Check', width: 14.71 }],
        [ 'gerealiseerd', { label: 'Gerealiseerd', width: 14.71 }],
        [ 'restcapaciteit', { label: 'Restcapaciteit', width: 14.71 }],
        [ 'year_2024', { label: '2024', width: 5.71 }],
        [ 'year_2025', { label: '2025', width: 5.71 }],
        [ 'year_2026', { label: '2026', width: 5.71 }],
        [ 'year_2027', { label: '2027', width: 5.71 }],
        [ 'year_2028', { label: '2028', width: 5.71 }],
        [ 'year_2029', { label: '2029', width: 5.71 }],
        [ 'year_2030', { label: '2030', width: 5.71 }],
        [ 'year_2031', { label: '2031', width: 5.71 }],
        [ 'year_2032', { label: '2032', width: 5.71 }],
        [ 'year_2033', { label: '2033', width: 5.71 }],
        [ 'year_2034_2038', { label: '2034 - 2038', width: 9.71 }],
        [ 'year_2039_2043', { label: '2039 - 2043', width: 9.71 }],
        [ 'years_check', { label: 'Check', width: 14.71 }],
      ]);
      const config = columnConfig.get(key);
      const label = config?.label || '';
      const width = config?.width || 5.71;
      return { header: label, key, width };
    });
    table.forEach((row: CategorieTableRowModel, idx) => {
      const excelRow = sheet.addRow(row);
      if (idx === 0 || idx === 19) {
        excelRow.getCell(4).value = '';
        excelRow.getCell(4).style = { fill: GREY_BACKGROUND };
      } else if (idx >= 1 && idx <= 3) {
        excelRow.getCell(4).value = { formula: '=C2-SUM(C3:C5)' };
      } else if (idx >= 4 && idx <= 8) {
        excelRow.getCell(4).value = { formula: '=C2-SUM(C6:C10)' };
      } else if (idx >= 9 && idx <= 10) {
        excelRow.getCell(4).value = { formula: '=C2-SUM(C11:C12)' };
      } else if (idx >= 11 && idx <= 19) {
        excelRow.getCell(4).value = { formula: '=C2-SUM(C13:C21)' };
      }
    });
    // Apply styling

    //const WHITE_TEXT = { color: { argb: 'FFFFFFFF' } };
    const BORDER_STYLE: { style: ExcelJS.BorderStyle; color: ExcelJS.Color } = { style: "thin", color: { argb: '000000', theme: 0 } };
    sheet.getRow(1).eachCell(cell => cell.style = { fill: GREY_BACKGROUND, border: { bottom: BORDER_STYLE } });
    sheet.mergeCells('B3:B5');
    sheet.mergeCells('D3:D5');
    sheet.mergeCells('B6:B10');
    sheet.mergeCells('D6:D10');
    sheet.mergeCells('B11:B12');
    sheet.mergeCells('D11:D12');
    sheet.mergeCells('B13:B20');
    sheet.mergeCells('D13:D20');
    const CENTER_ALIGNMENT: { vertical: 'middle'; horizontal: 'center' } = { vertical: 'middle', horizontal: 'center' };
    const coloredCellFormatter = (formatExtras?: Partial<ExcelJS.Style>) => (cell: ExcelJS.Cell, idx: number) => {
      if (idx === 2) cell.style = { fill: ORANGE_BACKGROUND, border: { bottom: BORDER_STYLE, right: BORDER_STYLE }, ...formatExtras };
      if (idx >= 3 && idx <= 5) {
        cell.style = { fill: BLUE_BACKGROUND, border: { bottom: idx === 5 ? BORDER_STYLE : undefined, right: BORDER_STYLE }, ...formatExtras };
      }
      if (idx >= 6 && idx <= 10) {
        cell.style = { fill: PINK_BACKGROUND, border: { bottom: idx === 10 ? BORDER_STYLE : undefined, right: BORDER_STYLE }, ...formatExtras };
      }
      if (idx >= 11 && idx <= 12) {
        cell.style = { fill: YELLOW_BACKGROUND, border: { bottom: idx === 12 ? BORDER_STYLE : undefined, right: BORDER_STYLE }, ...formatExtras };
      }
      if (idx >= 13 && idx <= 20) {
        cell.style = { fill: GREEN_BACKGROUND, border: { bottom: idx === 20 ? BORDER_STYLE : undefined, right: BORDER_STYLE }, ...formatExtras };
      }
      if (idx === 21) cell.style = { fill: DARK_YELLOW_BACKGROUND, border: { bottom: BORDER_STYLE, right: BORDER_STYLE }, ...formatExtras };
    };
    sheet.getColumn('A').eachCell(coloredCellFormatter());
    sheet.getColumn('B').eachCell(coloredCellFormatter({ alignment: CENTER_ALIGNMENT }));
    sheet.addConditionalFormatting({
      ref: 'D3:D20',
      rules: [
        {
          priority: 0,
          type: 'cellIs',
          formulae: [0],
          operator: 'equal',
          style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFA5CC5D' } } },
        },
        {
          priority: 1,
          type: 'cellIs',
          formulae: [0],
          operator: 'lessThan',
          style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE52C18' } } },
        },
        {
          priority: 2,
          type: 'cellIs',
          formulae: [0],
          operator: 'greaterThan',
          style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE52C18' } } },
        },
      ],
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileHelper.saveAsFile(blob, 'workbook.xlsx');
    });
  }

}
