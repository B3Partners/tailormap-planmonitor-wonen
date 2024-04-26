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
  years_check: number;
  valid: boolean;
}
