import type * as ExcelJS from 'exceljs';
import { FileHelper } from '@tailormap-viewer/shared';
import { CategorieTableRowModel } from '../models/categorie-table-row.model';
import { ColorHelper } from './color.helper';
import { ColumnHelper } from './column.helper';

const getColor = (groepNaam: keyof typeof ColorHelper.GROUP_COLORS) => {
  const color = ColorHelper.getGroupColor(groepNaam);
  return `FF${color.substring(1)}`;
};

const HEADER_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FFD9D9D8' } };
const NIEUWBOUW_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: getColor('nieuwbouw') } };
const WONINGTYPE_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: getColor('woningType') } };
const WONEN_ZORG_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: getColor('wonenEnZorg') } };
const FLEXWONING_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: getColor('flexwoningen') } };
const BETAALBAARHEID_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: getColor('betaalbaarheid') } };
const SLOOP_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: getColor('sloop') } };
const DISABLED_FIELD_BACKGROUND: ExcelJS.Fill = { type: "pattern", pattern: 'solid', fgColor: { argb: 'FFC0BFC0' } };
const BORDER_STYLE: { style: ExcelJS.BorderStyle; color: ExcelJS.Color } = { style: "thin", color: { argb: '000000', theme: 0 } };
const CENTER_ALIGNMENT: { vertical: 'middle'; horizontal: 'center' } = { vertical: 'middle', horizontal: 'center' };

const CONDITIONAL_FORMATTING_RULES: ExcelJS.ConditionalFormattingRule[] = [
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
];

const ROW_NUMBER = {
  LABELS: 1,
  NIEUWBOUW: 2,
  WONINGTYPE_BEGIN: 3,
  WONINGTYPE_END: 5,
  WONEN_ZORG_BEGIN: 6,
  WONEN_ZORG_END: 10,
  FLEXWONING_BEGIN: 11,
  FLEXWONING_END: 12,
  BETAALBAAR_BEGIN: 13,
  BETAALBAAR_END: 20,
  SLOOP: 21,
};

const WITH_BORDER_BOTTOM = new Set([
  ROW_NUMBER.LABELS,
  ROW_NUMBER.NIEUWBOUW,
  ROW_NUMBER.WONINGTYPE_END,
  ROW_NUMBER.WONEN_ZORG_END,
  ROW_NUMBER.FLEXWONING_END,
  ROW_NUMBER.BETAALBAAR_END,
  ROW_NUMBER.SLOOP,
]);

const COLUMN_INDEX = {
  LABEL: 1,
  GROEPNAAM: 2,
  CHECK_TOTAL: 4,
  RESTCAPACITEIT: 6,
  CHECK_YEARS: 19,
};

// width = character width + "magic" 5/7 to fix character width -> px conversion, see https://github.com/exceljs/exceljs/issues/744#issuecomment-1529795663
const COLUMN_CONFIG: Map<string, { label: string; width: number }> = new Map([
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

export class PlanregistratieTableExportHelper {

  public static async createExcelExport(
    plannaam: string,
    table: CategorieTableRowModel[],
  ) {
    const excelJS = await import('exceljs');
    const workbook = new excelJS.Workbook();
    PlanregistratieTableExportHelper.addPlanningSheet(workbook, plannaam, table);
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileHelper.saveAsFile(blob, 'workbook.xlsx');
    });
  }

  private static addPlanningSheet(
    workbook: ExcelJS.Workbook,
    plannaam: string,
    table: CategorieTableRowModel[],
  ) {
    const sheet = workbook.addWorksheet(plannaam);
    // Setup page
    sheet.pageSetup.paperSize = 9; /* ExcelJS.PaperSize.A4, because of isolatedModules can't use const enum without TS2748 error */
    // Setup columns
    sheet.columns = ColumnHelper.categorieColumns.map(key => {
      const config = COLUMN_CONFIG.get(key);
      return { header: config?.label || '', key, width: config?.width || 5.71 };
    });
    // Fill in data
    table.forEach((row: CategorieTableRowModel, idx) => {
      const excelRow = sheet.addRow(row);
      const rowNumber = idx + 2;
      let value: string | { formula: string } = '';
      if (rowNumber >= ROW_NUMBER.WONINGTYPE_BEGIN && rowNumber <= ROW_NUMBER.WONINGTYPE_END) {
        value = { formula: '=C2-SUM(C3:C5)' };
      } else if (rowNumber >= ROW_NUMBER.WONEN_ZORG_BEGIN && rowNumber <= ROW_NUMBER.WONEN_ZORG_END) {
        value = { formula: '=C2-SUM(C6:C10)' };
      } else if (rowNumber >= ROW_NUMBER.FLEXWONING_BEGIN && rowNumber <= ROW_NUMBER.FLEXWONING_END) {
        value = { formula: '=C2-SUM(C11:C12)' };
      } else if (rowNumber >= ROW_NUMBER.BETAALBAAR_BEGIN && rowNumber <= ROW_NUMBER.BETAALBAAR_END) {
        value = { formula: '=C2-SUM(C13:C20)' };
      }
      excelRow.getCell(COLUMN_INDEX.CHECK_TOTAL).value = value;
      excelRow.getCell(COLUMN_INDEX.RESTCAPACITEIT).value = { formula: `=C${rowNumber}-E${rowNumber}` };
      excelRow.getCell(COLUMN_INDEX.CHECK_YEARS).value = { formula: `=F${rowNumber}-SUM(G${rowNumber}:R${rowNumber})` };
    });
    // Merge groepnaam and total check cells
    PlanregistratieTableExportHelper.mergeGroepnaamCheckCells(sheet, [
      [ ROW_NUMBER.WONINGTYPE_BEGIN, ROW_NUMBER.WONINGTYPE_END ],
      [ ROW_NUMBER.WONEN_ZORG_BEGIN, ROW_NUMBER.WONEN_ZORG_END ],
      [ ROW_NUMBER.FLEXWONING_BEGIN, ROW_NUMBER.FLEXWONING_END ],
      [ ROW_NUMBER.BETAALBAAR_BEGIN, ROW_NUMBER.BETAALBAAR_END ],
    ]);
    // Set the styles
    PlanregistratieTableExportHelper.setSheetStyles(sheet);
    // Add conditional formatting for check columns
    sheet.addConditionalFormatting({ ref: 'D3:D20', rules: CONDITIONAL_FORMATTING_RULES });
    sheet.addConditionalFormatting({ ref: 'S2:S20', rules: CONDITIONAL_FORMATTING_RULES });
    return sheet;
  }

  private static mergeGroepnaamCheckCells(sheet: ExcelJS.Worksheet, ranges: Array<[ number, number ]>) {
    ranges.forEach(range => {
      sheet.mergeCells(`B${range[0]}:B${range[1]}`);
      sheet.mergeCells(`D${range[0]}:D${range[1]}`);
    });
  }

  private static setSheetStyles(sheet: ExcelJS.Worksheet) {
    sheet.getColumn(COLUMN_INDEX.LABEL).eachCell(PlanregistratieTableExportHelper.coloredCellFormatter());
    sheet.getColumn(COLUMN_INDEX.GROEPNAAM).eachCell(PlanregistratieTableExportHelper.coloredCellFormatter(true));
    sheet.getColumn(COLUMN_INDEX.CHECK_TOTAL).eachCell((cell, rowIdx) => {
      if (rowIdx < ROW_NUMBER.NIEUWBOUW) {
        return;
      }
      PlanregistratieTableExportHelper.setStyle(cell, {
        fill: rowIdx === ROW_NUMBER.NIEUWBOUW || rowIdx === ROW_NUMBER.SLOOP ? DISABLED_FIELD_BACKGROUND : undefined,
        alignment: CENTER_ALIGNMENT,
        border: { bottom: BORDER_STYLE, right: BORDER_STYLE, left: BORDER_STYLE },
      });
    });
    sheet.getColumn(COLUMN_INDEX.RESTCAPACITEIT).eachCell((cell, rowIdx) => {
      if (rowIdx < ROW_NUMBER.NIEUWBOUW) {
        return;
      }
      PlanregistratieTableExportHelper.setStyle(cell, { fill: DISABLED_FIELD_BACKGROUND, border: { left: BORDER_STYLE, right: BORDER_STYLE } });
    });
    sheet.getColumn(COLUMN_INDEX.CHECK_YEARS).eachCell(cell => {
      PlanregistratieTableExportHelper.setStyle(cell, { border: { left: BORDER_STYLE, right: BORDER_STYLE } });
    });

    sheet.getRow(ROW_NUMBER.LABELS).eachCell(cell => PlanregistratieTableExportHelper.setStyle(cell, { fill: HEADER_BACKGROUND }));
    sheet.getRow(ROW_NUMBER.SLOOP).eachCell((cell, colIdx) => {
      if (colIdx <= COLUMN_INDEX.RESTCAPACITEIT) {
        return;
      }
      cell.value = '';
      PlanregistratieTableExportHelper.setStyle(cell, {
        fill: DISABLED_FIELD_BACKGROUND,
        border: { bottom: BORDER_STYLE, right: colIdx === COLUMN_INDEX.CHECK_YEARS ? BORDER_STYLE : undefined },
      });
    });
    Array.from(WITH_BORDER_BOTTOM).forEach(rowIdx => {
      sheet.getRow(rowIdx).eachCell(cell => {
        PlanregistratieTableExportHelper.setStyle(cell, { border: { bottom: BORDER_STYLE } });
      });
    });
  }

  private static setStyle(
    cell: ExcelJS.Cell,
    style: { fill?: ExcelJS.Fill | undefined; border?: Partial<ExcelJS.Borders>; alignment?: Partial<ExcelJS.Alignment> },
  ) {
    cell.style = {
      fill: style.fill || cell.style.fill,
      border: { ...cell.style.border, ...style.border },
      alignment: style.alignment || cell.style.alignment,
    };
  }

  private static coloredCellFormatter(alignmentCenter?: boolean) {
   return (cell: ExcelJS.Cell, idx: number) => {
      let fill: ExcelJS.Fill | undefined = undefined;
      if (idx === ROW_NUMBER.NIEUWBOUW) fill = NIEUWBOUW_BACKGROUND;
      if (idx >= ROW_NUMBER.WONINGTYPE_BEGIN && idx <= ROW_NUMBER.WONINGTYPE_END) fill = WONINGTYPE_BACKGROUND;
      if (idx >= ROW_NUMBER.WONEN_ZORG_BEGIN && idx <= ROW_NUMBER.WONEN_ZORG_END) fill = WONEN_ZORG_BACKGROUND;
      if (idx >= ROW_NUMBER.FLEXWONING_BEGIN && idx <= ROW_NUMBER.FLEXWONING_END) fill = FLEXWONING_BACKGROUND;
      if (idx >= ROW_NUMBER.BETAALBAAR_BEGIN && idx <= ROW_NUMBER.BETAALBAAR_END) fill = BETAALBAARHEID_BACKGROUND;
      if (idx === ROW_NUMBER.SLOOP) fill = SLOOP_BACKGROUND;
      PlanregistratieTableExportHelper.setStyle(cell, { fill: fill, border: { right: BORDER_STYLE }, alignment: alignmentCenter ? CENTER_ALIGNMENT : undefined });
    };
  }

}
