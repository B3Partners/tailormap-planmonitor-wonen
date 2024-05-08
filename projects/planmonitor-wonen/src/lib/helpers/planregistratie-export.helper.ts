import { Workbook } from "exceljs";
import { PlancategorieHelper } from './plancategorie.helper';
import { FileHelper } from '@tailormap-viewer/shared';
import { CategorieTableRowModel } from '../models/categorie-table-row.model';

export class PlanregistratieExportHelper {

  public static createExcelExport(
    plannaam: string,
    table: CategorieTableRowModel[],
  ) {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet(plannaam);
    sheet.columns = PlancategorieHelper.categorieColumns.map(key => {
      const labels: Record<string, string> = {
        'label': '',
        'groeplabel': 'Groepnaam',
        'totalen': 'Totalen',
        'total_check': 'Check',
        'gerealiseerd': 'Gerealiseerd',
        'restcapaciteit': 'Restcapaciteit',
        'year_2024': '2024',
        'year_2025': '2025',
        'year_2026': '2026',
        'year_2027': '2027',
        'year_2028': '2028',
        'year_2029': '2029',
        'year_2030': '2030',
        'year_2031': '2031',
        'year_2032': '2032',
        'year_2033': '2033',
        'year_2034_2038': '2034 - 2038',
        'year_2039_2043': '2039 - 2043',
        'years_check': 'Check',
      };
      const label = labels[key] || '';
      return { header: label, key };
    });
    table.forEach(row => sheet.addRow(row));
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileHelper.saveAsFile(blob, 'workbook.xlsx');
    });
  }

}
