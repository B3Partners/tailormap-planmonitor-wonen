import { CategorieTableRowModel } from './categorie-table-row.model';

// eslint-disable-next-line max-len
export type YearColumn = keyof Pick<CategorieTableRowModel, 'year_2024' | 'year_2025' | 'year_2026' | 'year_2027' | 'year_2028' | 'year_2029' | 'year_2030' | 'year_2031' | 'year_2032' | 'year_2033' | 'year_2034' | 'year_2035' | 'year_2036' | 'year_2037' | 'year_2038' | 'year_2039' | 'year_2040' | 'year_2041' | 'year_2042' | 'year_2043' | 'year_2034_2038' | 'year_2039_2043'>;

export interface YearColumnModel {
  year: YearColumn;
  valid: boolean;
}
