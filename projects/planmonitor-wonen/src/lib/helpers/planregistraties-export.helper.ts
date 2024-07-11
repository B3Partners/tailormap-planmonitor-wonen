import * as ExcelJS from 'exceljs';
import { FileHelper } from '@tailormap-viewer/shared';
import { PlanregistratieWithDetailsModel } from '../models/planregistratie-with-details.model';
import { DateTime } from 'luxon';
import { PlanregistratieModel } from '../models';
import { CategorieRowModel, PlancategorieTableHelper } from './plancategorie-table.helper';
import { ColumnHelper } from './column.helper';

export enum ExportType {
  EENVOUDIG = "EENVOUDIG",
  UITGEBREID = "UITGEBREID",
  DRAAITABEL = "DRAAITABEL",
}

export const EXPORT_TYPE_LABELS = {
  [ExportType.EENVOUDIG]: "Eenvoudig",
  [ExportType.UITGEBREID]: "Uitgebreid",
  [ExportType.DRAAITABEL]: "Draaitabel",
};

type RowType = Record<string, string | number | boolean | Date>;

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

const COLUMN_TRANSLATION: Record<string, string> = {
  totalen: 'Totaal',
  gerealiseerd: 'Gerealiseerd',
  restcapaciteit: 'Restcapaciteit',
  'nieuwbouw': 'Nieuwbouw',
  'woningtype': 'Woningtype',
  'wonen en zorg': 'Wonen en zorg',
  'flexwoningen': 'Flexwoningen',
  'betaalbaarheid': 'Betaalbaarheid',
  'sloop': 'Sloop',
};

export class PlanregistratiesExportHelper {

  public static createExcelExport(
    exportType: ExportType,
    registraties: PlanregistratieWithDetailsModel[],
  ) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(EXPORT_TYPE_LABELS[exportType]);
    if (exportType === ExportType.EENVOUDIG) {
      PlanregistratiesExportHelper.addEenvoudigExport(sheet, registraties);
    }
    if (exportType === ExportType.UITGEBREID) {
      PlanregistratiesExportHelper.addUitgebreideExport(sheet, registraties);
    }
    if (exportType === ExportType.DRAAITABEL) {
      PlanregistratiesExportHelper.addDraaitabelExport(sheet, registraties);
    }
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileHelper.saveAsFile(blob, `planmonitor-wonen-export-${DateTime.now().toISODate()}.xlsx`);
    });
  }

  private static addEenvoudigExport(
    sheet: ExcelJS.Worksheet,
    registraties: PlanregistratieWithDetailsModel[],
  ) {
    const data: RowType[] = registraties.map(registratie => {
      const rowData = PlanregistratiesExportHelper.getRegistratieBaseData(registratie);
      PlancategorieTableHelper.categorieen.forEach(categorie => {
        const c = registratie.plancategorieList.find(p => p[categorie.field] === categorie.fieldValue);
        if (!c) {
          return;
        }
        const categoryTotal = registratie.detailplanningList
          .filter(d => d.plancategorieId === c.id)
          .reduce((total, detail) => detail.aantalGepland + total, 0);
        const key = `${categorie.field}_${categorie.fieldValue}`;
        rowData[key] = categoryTotal || "";
      });
      return rowData;
    });
    const columns: Array<[string, string]> = [
      ...BASE_COLUMNS,
      ...PlancategorieTableHelper.categorieen.map<[string, string]>(c => [ `${c.field}_${c.fieldValue}`, PlanregistratiesExportHelper.getCategorieLabel(c) ]),
    ];
    sheet.columns = columns.map(([ key, label ]) => ({ header: label || '', key }));
    data.forEach(row => sheet.addRow(row));
  }

  private static addUitgebreideExport(
    sheet: ExcelJS.Worksheet,
    registraties: PlanregistratieWithDetailsModel[],
  ) {
    const valueColumnKeys = ColumnHelper.expandedCategorieColumns.filter(col => {
      return col === 'totalen' || col === 'gerealiseerd' || col === 'restcapaciteit' || col.indexOf('year_') === 0;
    });
    const data: RowType[] = registraties.map(registratie => {
      const tableData = PlancategorieTableHelper.getPlancategorieTable(registratie.plancategorieList, registratie.detailplanningList);
      const rowData = PlanregistratiesExportHelper.getRegistratieBaseData(registratie);
      PlancategorieTableHelper.categorieen.forEach(categorie => {
        const c = tableData.rows.find(t => t.groep === categorie.field && t.value === categorie.fieldValue);
        if (!c) {
          return;
        }
        valueColumnKeys.forEach(column => {
          const key = `${categorie.field}_${categorie.fieldValue}_${column}`;
          rowData[key] = c[column] || "";
        });
      });
      return rowData;
    });
    const valueColumnLabels: Array<[ string, string ]> = [];
    PlancategorieTableHelper.categorieen.forEach(c => {
      valueColumnKeys.forEach(column => {
        const key = `${c.field}_${c.fieldValue}_${column}`;
        const baseLabel = PlanregistratiesExportHelper.getCategorieLabel(c);
        let columnName = column.replace("year_", "");
        if (COLUMN_TRANSLATION[columnName]) {
          columnName = COLUMN_TRANSLATION[columnName];
        }
        valueColumnLabels.push([ key, baseLabel + " " + columnName ]);
      });
    });
    const columns: Array<[string, string]> = [ ...BASE_COLUMNS, ...valueColumnLabels ];
    sheet.columns = columns.map(([ key, label ]) => ({ header: label || '', key }));
    data.forEach(row => sheet.addRow(row));
  }

  private static addDraaitabelExport(
    sheet: ExcelJS.Worksheet,
    registraties: PlanregistratieWithDetailsModel[],
  ) {
    const data: RowType[] = [];
    const yearColumns = ColumnHelper.allYears
      .filter(col => col !== 'year_2039_2043' && col !== 'year_2034_2038')
      .map(col => col.replace('year_', ''));
    registraties.forEach(registratie => {
      PlancategorieTableHelper.categorieen.forEach(categorie => {
        const c = registratie.plancategorieList.find(p => p[categorie.field] === categorie.fieldValue);
        const rowData = PlanregistratiesExportHelper.getRegistratieBaseData(registratie);
        rowData['woningtype'] = PlanregistratiesExportHelper.getCategorieLabel(categorie);
        yearColumns.forEach(year => {
          if (!c) {
            rowData[year] = "";
            return;
          }
          const planning = registratie.detailplanningList.find(d => d.plancategorieId === c.id && d.jaartal === +year);
          rowData[year] = planning ? planning.aantalGepland : "";
        });
        data.push(rowData);
      });
    });
    const columns: Array<[string, string]> = [
      ...BASE_COLUMNS,
      [ 'woningtype', 'Woningtype' ],
      ...yearColumns.map<[string, string]>(year => [ year, year ]),
    ];
    sheet.columns = columns.map(([ key, label ]) => ({ header: label || '', key }));
    data.forEach(row => sheet.addRow(row));
  }

  private static getRegistratieBaseData(registratie: PlanregistratieWithDetailsModel): Record<string, string | number | boolean | Date> {
    const data: RowType = {};
    BASE_COLUMNS.forEach(([column]) => data[column] = PlanregistratiesExportHelper.getValue(registratie[column] ?? ""));
    return data;
  }

  private static getCategorieLabel(categorie: CategorieRowModel) {
    if (categorie.label.toLowerCase() === 'onbekend') {
      return `${COLUMN_TRANSLATION[categorie.groepnaam] ? COLUMN_TRANSLATION[categorie.groepnaam] : categorie.groepnaam} ${categorie.label}`;
    }
    return categorie.label;
  }

  private static getValue(value: string | number | boolean | Date) {
    if (typeof value === "boolean") {
      return value ? "ja" : "nee";
    }
    if (value instanceof Date) {
      return DateTime.fromJSDate(value).toFormat("dd-mm-yyyy");
    }
    return value;
  }

}
