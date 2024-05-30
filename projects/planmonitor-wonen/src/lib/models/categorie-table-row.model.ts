import { PlancategorieModel } from './index';

export interface CategorieTableRowModel {
  id: string;
  cls: string;
  groep: keyof PlancategorieModel;
  value: string;
  label: string;
  groeplabel: string;
  totalen: number;
  total_check: number;
  gerealiseerd: number;
  restcapaciteit: number;
  year_2024: number | string;
  year_2025: number | string;
  year_2026: number | string;
  year_2027: number | string;
  year_2028: number | string;
  year_2029: number | string;
  year_2030: number | string;
  year_2031: number | string;
  year_2032: number | string;
  year_2033: number | string;
  year_2034: number | string;
  year_2035: number | string;
  year_2036: number | string;
  year_2037: number | string;
  year_2038: number | string;
  year_2039: number | string;
  year_2040: number | string;
  year_2041: number | string;
  year_2042: number | string;
  year_2043: number | string;
  year_2034_2038: number | string;
  year_2039_2043: number | string;
  years_check: number;
  valid: boolean;
  disabled?: boolean;
}
