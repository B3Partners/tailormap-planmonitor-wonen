import { YearColumn } from '../models/year-table-column.model';

export class ColumnHelper {

  public static allYears: YearColumn[] = [
    'year_2024',
    'year_2025',
    'year_2026',
    'year_2027',
    'year_2028',
    'year_2029',
    'year_2030',
    'year_2031',
    'year_2032',
    'year_2033',
    'year_2034',
    'year_2035',
    'year_2036',
    'year_2037',
    'year_2038',
    'year_2039',
    'year_2040',
    'year_2041',
    'year_2042',
    'year_2043',
    'year_2034_2038',
    'year_2039_2043',
  ];

  public static categorieColumns: string[] = [
    'label',
    'groeplabel',
    'totalen',
    'total_check',
    'gerealiseerd',
    'restcapaciteit',
    'year_2024',
    'year_2025',
    'year_2026',
    'year_2027',
    'year_2028',
    'year_2029',
    'year_2030',
    'year_2031',
    'year_2032',
    'year_2033',
    'year_2034_2038',
    'year_2039_2043',
    'years_check',
  ];

  public static expandedCategorieColumns = [
    ...ColumnHelper.categorieColumns.slice(0, -3),
    'year_2034',
    'year_2035',
    'year_2036',
    'year_2037',
    'year_2038',
    'year_2039',
    'year_2040',
    'year_2041',
    'year_2042',
    'year_2043',
    'years_check',
  ];

}
