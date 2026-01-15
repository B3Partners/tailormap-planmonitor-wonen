import type * as ExcelJS from 'exceljs';
import { PlancategorieModel } from '../models/plancategorie.model';
import { CategorieRowModel, PlancategorieTableHelper } from './plancategorie-table.helper';

export interface CategorieImportResult {
  categorieGroep: keyof PlancategorieModel;
  categorieValue: string;
  totaalGepland: number;
  totaalGerealiseerd: number;
  detailPlanningRows: DetailPlanningImportRow[];
}

export interface DetailPlanningImportRow {
  jaartal: number;
  aantalGepland: number;
}

export class PlanregistratiesImportHelper {

  public static async importExcelFile(file: File | ArrayBuffer): Promise<CategorieImportResult[]> {
    const excelJS = await import('exceljs');
    const workbook = new excelJS.Workbook();

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
    } else {
      await workbook.xlsx.load(file);
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('No worksheet found in the Excel file');
    }

    const plancategorieList: CategorieImportResult[] = [];
    PlancategorieTableHelper.categorieen.forEach(categorieRow => {
      const categoryRowIndex = PlanregistratiesImportHelper.findRowIndexForCategorie(worksheet, categorieRow);
      if (categoryRowIndex === null) {
        return;
      }
      const categoryRow = worksheet.getRow(categoryRowIndex);
      // Read totalen (column C) and gerealiseerd (column E)
      const totaalGepland = PlanregistratiesImportHelper.parseNumericValue(categoryRow.getCell(3).value);
      const totaalGerealiseerd = PlanregistratiesImportHelper.parseNumericValue(categoryRow.getCell(5).value);
      const planCategorie: CategorieImportResult = {
        categorieGroep: categorieRow.field,
        categorieValue: categorieRow.fieldValue,
        totaalGepland,
        totaalGerealiseerd,
        detailPlanningRows: [],
      };
      // Read year data (columns G onwards: 2024, 2025, ..., 2043)
      const yearStartColumn = 7; // Column G
      for (let year = 2024; year <= 2043; year++) {
        const yearColumnIndex = yearStartColumn + (year - 2024);
        const yearValue = categoryRow.getCell(yearColumnIndex).value;
        const aantalGepland = PlanregistratiesImportHelper.parseNumericValue(yearValue);
        if (aantalGepland > 0) {
          planCategorie.detailPlanningRows.push({
            jaartal: year,
            aantalGepland,
          });
        }
      }
      plancategorieList.push(planCategorie);
    });
    return plancategorieList;
  }

  private static findRowIndexForCategorie(
    worksheet: ExcelJS.Worksheet,
    categorie: CategorieRowModel,
  ): number | null {
    let categoryRowIndex = -1;
    for (let i = 1; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const labelCell = row.getCell(1).value?.toString() || '';
      const groupCell = row.getCell(2).value?.toString() || '';
      if (labelCell === categorie.label && groupCell === categorie.groepnaam) {
        categoryRowIndex = i;
        break;
      }
    }
    return categoryRowIndex === -1 ? null : categoryRowIndex;
  }

  private static parseCellValue(value: ExcelJS.CellValue): string | number | boolean | Date | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    // Handle rich text
    if (typeof value === 'object' && 'richText' in value) {
      return value.richText.map((rt: { text: string }) => rt.text).join('');
    }

    // Handle formulas - get the result
    if (typeof value === 'object' && 'result' in value) {
      return PlanregistratiesImportHelper.parseCellValue(value.result);
    }

    // Handle shared formulas
    if (typeof value === 'object' && 'sharedFormula' in value) {
      return '';
    }

    // Handle dates
    if (value instanceof Date) {
      return value;
    }

    // Handle strings that represent booleans
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue === 'ja' || lowerValue === 'yes' || lowerValue === 'true') {
        return true;
      }
      if (lowerValue === 'nee' || lowerValue === 'no' || lowerValue === 'false') {
        return false;
      }
    }

    // Handle numbers
    if (typeof value === 'number') {
      return value;
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return value;
    }

    // Return as string for any other type
    return value.toString();
  }

  private static parseNumericValue(value: ExcelJS.CellValue): number {
    const parsed = PlanregistratiesImportHelper.parseCellValue(value);

    if (typeof parsed === 'number') {
      return parsed;
    }

    if (typeof parsed === 'string') {
      const num = parseFloat(parsed);
      return isNaN(num) ? 0 : num;
    }

    return 0;
  }

}
