import type * as ExcelJS from 'exceljs';
import { PlanregistratieModel } from '../models';
import { PlanregistratieWithDetailsModel } from '../models/planregistratie-with-details.model';
import { PlancategorieModel } from '../models/plancategorie.model';
import { DetailplanningModel } from '../models/detailplanning.model';
import { PlancategorieTableHelper } from './plancategorie-table.helper';
import { PlanMonitorModelHelper } from './planmonitor-model.helper';

const BASE_COLUMNS: Array<[keyof PlanregistratieModel, string]> = [
  [ "id", "ID" ],
  [ "planNaam", "Plannaam" ],
  [ "plaatsnaam", "Plaatsnaam" ],
  [ "gemeente", "Gemeente" ],
  [ "regio", "Regio" ],
  [ "provincie", "Provincie" ],
  [ "plantype", "Plantype" ],
  [ "vertrouwelijkheid", "Vertrouwelijkheid" ],
  [ "statusProject", "Status Project" ],
  [ "statusPlanologisch", "Status Planologisch" ],
  [ "knelpuntenMeerkeuze", "Knelpunten" ],
  [ "beoogdWoonmilieuAbf13", "Woonmilieu" ],
  [ "aantalStudentenwoningen", "Studentenwoningen" ],
  [ "opdrachtgeverType", "Opdrachtegever" ],
  [ "opdrachtgeverNaam", "Opdrachtgever Naam" ],
  [ "sleutelproject", "Sleutelproject" ],
  [ "opmerkingen", "Opmerkingen" ],
];

export class PlanregistratiesImportHelper {

  public static async importExcelFile(file: File | ArrayBuffer): Promise<PlanregistratieWithDetailsModel> {
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

    // Read base plan information from rows 1-16 (column B contains the values)
    const fieldLabelMap = new Map<string, keyof PlanregistratieModel>();
    BASE_COLUMNS.forEach(([ key, label ]) => {
      fieldLabelMap.set(label, key);
    });

    const basePlan: Partial<PlanregistratieModel> = {
      isNew: true,
    };

    // Read base plan data from rows 1-16
    for (let rowIndex = 1; rowIndex <= 16; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      const label = row.getCell(1).value?.toString() || '';
      const value = row.getCell(2).value; // Column B

      const fieldKey = fieldLabelMap.get(label);
      if (fieldKey && value !== null && value !== undefined) {
        const parsedValue = PlanregistratiesImportHelper.parseCellValue(value);
        // Handle arrays (knelpuntenMeerkeuze)
        if (fieldKey === 'knelpuntenMeerkeuze' && typeof parsedValue === 'string') {
          basePlan[fieldKey] = parsedValue.split(',').map(v => v.trim()).filter(v => v) as any;
        } else {
          (basePlan as any)[fieldKey] = parsedValue;
        }
      }
    }

    // Read category data starting from row 19
    const plancategorieList: PlancategorieModel[] = [];
    const detailplanningList: DetailplanningModel[] = [];

    PlancategorieTableHelper.categorieen.forEach(categorieRow => {
      // Find the row for this category
      let categoryRowIndex = -1;
      for (let i = 19; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const labelCell = row.getCell(1).value?.toString() || '';
        const groupCell = row.getCell(2).value?.toString() || '';

        if (labelCell === categorieRow.label && groupCell === categorieRow.groepnaam) {
          categoryRowIndex = i;
          break;
        }
      }

      if (categoryRowIndex === -1) {
        return;
      }

      const categoryRow = worksheet.getRow(categoryRowIndex);
      // Read totalen (column C) and gerealiseerd (column E)
      const totalenValue = categoryRow.getCell(3).value;
      const gerealiseerdeValue = categoryRow.getCell(5).value;

      const totaalGepland = PlanregistratiesImportHelper.parseNumericValue(totalenValue);
      const totaalGerealiseerd = PlanregistratiesImportHelper.parseNumericValue(gerealiseerdeValue);

      const planCategorie = PlanMonitorModelHelper.getNewPlancategorie({
        planregistratieId: '',
        nieuwbouw: categorieRow.field === 'nieuwbouw' ? categorieRow.fieldValue as any : null,
        woningType: categorieRow.field === 'woningType' ? categorieRow.fieldValue as any : null,
        wonenEnZorg: categorieRow.field === 'wonenEnZorg' ? categorieRow.fieldValue as any : null,
        flexwoningen: categorieRow.field === 'flexwoningen' ? categorieRow.fieldValue as any : null,
        betaalbaarheid: categorieRow.field === 'betaalbaarheid' ? categorieRow.fieldValue as any : null,
        sloop: categorieRow.field === 'sloop' ? categorieRow.fieldValue as any : null,
        totaalGepland,
        totaalGerealiseerd,
      });
      plancategorieList.push(planCategorie);

      // Read year data (columns G onwards: 2024, 2025, ..., 2043)
      const yearStartColumn = 7; // Column G
      for (let year = 2024; year <= 2043; year++) {
        const yearColumnIndex = yearStartColumn + (year - 2024);
        const yearValue = categoryRow.getCell(yearColumnIndex).value;
        const aantalGepland = PlanregistratiesImportHelper.parseNumericValue(yearValue);

        if (aantalGepland > 0) {
          detailplanningList.push(PlanMonitorModelHelper.getNewDetailplanning({
            plancategorieId: planCategorie.id,
            jaartal: year,
            aantalGepland,
          }));
        }
      }
    });

    return {
      ...PlanMonitorModelHelper.getNewPlanregistratie(basePlan),
      plancategorieList,
      detailplanningList,
    };
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
