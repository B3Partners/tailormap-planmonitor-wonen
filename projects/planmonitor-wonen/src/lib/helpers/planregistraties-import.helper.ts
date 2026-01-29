import type * as ExcelJS from 'exceljs';
import { PlancategorieModel } from '../models/plancategorie.model';
import { CategorieRowModel, PlancategorieTableHelper } from './plancategorie-table.helper';
import { ExcelHelper } from './excel.helper';

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

  private static invalidNumber = Symbol('invalidNumber');
  private static emptyNumber = Symbol('emptyNumber');

  public static async importExcelFile(file: File | ArrayBuffer): Promise<{ result?: CategorieImportResult[]; errors: string[] }> {
    const workbook = await ExcelHelper.getNewWorkbook();

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
    } else {
      await workbook.xlsx.load(file);
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return { errors: ['Geen werkblad gevonden in het Excel-bestand.'] };
    }

    const errors: string[] = [];
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

      if (totaalGepland === PlanregistratiesImportHelper.invalidNumber) {
        PlanregistratiesImportHelper.addError(errors, `Totaal gepland in rij ${categoryRowIndex} is ongeldig.`);
      }
      if (totaalGerealiseerd === PlanregistratiesImportHelper.invalidNumber) {
        PlanregistratiesImportHelper.addError(errors, `Totaal gerealiseerd in rij ${categoryRowIndex} is ongeldig.`);
      }

      const planCategorie: CategorieImportResult = {
        categorieGroep: categorieRow.field,
        categorieValue: categorieRow.fieldValue,
        totaalGepland: typeof totaalGepland === 'number' ? totaalGepland : 0,
        totaalGerealiseerd: typeof totaalGerealiseerd === 'number' ? totaalGerealiseerd : 0,
        detailPlanningRows: [],
      };
      // Read year data (columns G onwards: 2024, 2025, ..., 2043)
      const yearStartColumn = 7; // Column G
      for (let year = 2024; year <= 2043; year++) {
        const yearColumnIndex = yearStartColumn + (year - 2024);
        const yearValue = categoryRow.getCell(yearColumnIndex).value;
        // Check if column header year matches year
        const headerRow = worksheet.getRow(1);
        const jaartal = PlanregistratiesImportHelper.parseNumericValue(headerRow.getCell(yearColumnIndex).value);
        if (typeof jaartal !== 'number') {
          continue;
        }
        const aantalGepland = PlanregistratiesImportHelper.parseNumericValue(yearValue);
        if (aantalGepland === PlanregistratiesImportHelper.invalidNumber) {
          PlanregistratiesImportHelper.addError(errors, `Aantal gepland voor jaar ${jaartal} in rij ${categoryRowIndex} is ongeldig.`);
        } else if(typeof aantalGepland === 'number' && aantalGepland > 0) {
          planCategorie.detailPlanningRows.push({
            jaartal,
            aantalGepland,
          });
        }
      }
      if (planCategorie.detailPlanningRows.length > 0) {
        plancategorieList.push(planCategorie);
      }
    });

    return { result: plancategorieList, errors };
  }

  private static addError(errors: string[], message: string) {
    if (errors.includes(message)) {
      return;
    }
    errors.push(message);
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

  public static parseNumericValue(value: ExcelJS.CellValue): number | symbol {
    const parsed = PlanregistratiesImportHelper.parseCellValue(value);

    if (value === null || parsed === null || typeof value === 'undefined' || typeof parsed === 'undefined') {
      return PlanregistratiesImportHelper.emptyNumber;
    }

    if (typeof parsed === 'number') {
      return parsed;
    }

    if (typeof parsed === 'string') {
      const s = parsed.trim().replace(/\s+/g, '');

      if (s === '') {
        return PlanregistratiesImportHelper.emptyNumber;
      }

      const dotCount = (s.match(/\./g) || []).length;
      const commaCount = (s.match(/,/g) || []).length;

      let normalized = s;

      // Both separators present: last one is decimal
      if (dotCount > 0 && commaCount > 0) {
        if (s.lastIndexOf('.') > s.lastIndexOf(',')) {
          normalized = s.replace(/,/g, '');
        } else {
          normalized = s.replace(/\./g, '').replace(',', '.');
        }
      }
      // Only dots: multiple = thousands, single with 3 digits = thousands
      else if (dotCount > 0) {
        const afterDot = s.split('.').pop()?.length || 0;
        if (dotCount > 1 || afterDot === 3) {
          normalized = s.replace(/\./g, '');
        }
      }
      // Only commas: multiple = thousands, single with 3 digits = thousands
      else if (commaCount > 0) {
        const afterComma = s.split(',').pop()?.length || 0;
        if (commaCount > 1 || afterComma === 3) {
          normalized = s.replace(/,/g, '');
        } else {
          normalized = s.replace(',', '.');
        }
      }

      const result = parseFloat(normalized);
      return isNaN(result) ? PlanregistratiesImportHelper.invalidNumber : result;
    }

    return PlanregistratiesImportHelper.invalidNumber;
  }

}
