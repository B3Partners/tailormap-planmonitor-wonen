import { CategorieTableRowModel } from './categorie-table-row.model';
import { YearColumnModel } from './year-table-column.model';

export interface CategorieTableModel {
  rows: CategorieTableRowModel[];
  yearColumns: YearColumnModel[];
}
