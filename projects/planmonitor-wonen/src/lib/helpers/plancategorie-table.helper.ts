import { BetaalbaarheidEnum, DetailplanningModel, PlancategorieModel, WonenEnZorgEnum, WoningtypeEnum } from '../models';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { FlexwoningenEnum } from '../models/flexwoningen.enum';
import { SloopEnum } from '../models/sloop.enum';
import { CategorieGroepField, CategorieTableRowModel } from '../models/categorie-table-row.model';
import { YearColumn, YearColumnModel } from '../models/year-table-column.model';
import { CategorieTableModel } from '../models/categorie-table.model';
import { ColumnHelper } from './column.helper';


export interface CategorieRowModel {
  id: string;
  label: string;
  groepnaam: string;
  field: CategorieGroepField;
  fieldValue: string;
  extraCls?: string;
}

interface YearTotal {
  nieuwbouw: number;
  woningType: number;
  wonenEnZorg: number;
  flexwoningen: number;
  betaalbaarheid: number;
  sloop: number;
}

export class PlancategorieTableHelper {

  public static categorieen: CategorieRowModel[] = [
    { id: 'nieuwbouw-nieuwbouw', label: 'Nieuwbouw', groepnaam: 'nieuwbouw', field: "nieuwbouw", fieldValue: NieuwbouwEnum.NIEUWBOUW, extraCls: 'line-below' },
    { id: 'woningtype-eengezins', label: 'Eengezins', groepnaam: 'woningtype', field: 'woningType', fieldValue: WoningtypeEnum.EENGEZINS },
    { id: 'woningtype-meergezins', label: 'Meergezins', groepnaam: 'woningtype', field: 'woningType', fieldValue: WoningtypeEnum.MEERGEZINS },
    { id: 'woningtype-onbekend', label: 'Onbekend', groepnaam: 'woningtype', field: 'woningType', fieldValue: WoningtypeEnum.ONBEKEND, extraCls: 'line-below' },
    { id: 'wonenenzorg-nultreden', label: 'Nultreden', groepnaam: 'wonen en zorg', field: 'wonenEnZorg', fieldValue: WonenEnZorgEnum.NULTREDEN },
    { id: 'wonenenzorg-geclusterd', label: 'Geclusterd', groepnaam: 'wonen en zorg', field: 'wonenEnZorg', fieldValue: WonenEnZorgEnum.GECLUSTERD },
    { id: 'wonenenzorg-zorggeschikt', label: 'Zorggeschikt', groepnaam: 'wonen en zorg', field: 'wonenEnZorg', fieldValue: WonenEnZorgEnum.ZORGGESCHIKT },
    { id: 'wonenenzorg-onbekend', label: 'Onbekend', groepnaam: 'wonen en zorg', field: 'wonenEnZorg', fieldValue: WonenEnZorgEnum.ONBEKEND },
    { id: 'wonenenzorg-regulier', label: 'Regulier', groepnaam: 'wonen en zorg', field: 'wonenEnZorg', fieldValue: WonenEnZorgEnum.REGULIER, extraCls: 'line-below' },
    { id: 'flexwoningen-flexwoningen', label: 'Flexwoningen', groepnaam: 'flexwoningen', field: 'flexwoningen', fieldValue: FlexwoningenEnum.FLEXWONINGEN },
    // eslint-disable-next-line max-len
    { id: 'flexwoningen-regulier_permanent', label: 'Regulier permanent', groepnaam: 'flexwoningen', field: 'flexwoningen', fieldValue: FlexwoningenEnum.REGULIER_PERMANENT, extraCls: 'line-below' },
    { id: 'betaalbaarheid-sociale_huur', label: 'Sociale huur', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.SOCIALE_HUUR },
    { id: 'betaalbaarheid-huur_middenhuur', label: 'Huur middenhuur', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.HUUR_MIDDENHUUR },
    { id: 'betaalbaarheid-huur_dure_huur', label: 'Huur dure huur', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.HUUR_DURE_HUUR },
    { id: 'betaalbaarheid-huur_onbekend', label: 'Huur onbekend', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.HUUR_ONBEKEND },
    // eslint-disable-next-line max-len
    { id: 'betaalbaarheid-koop_betaalbare_koop', label: 'Koop betaalbare koop', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.KOOP_BETAALBARE_KOOP },
    { id: 'betaalbaarheid-koop_dure_koop', label: 'Koop dure koop', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.KOOP_DURE_KOOP },
    { id: 'betaalbaarheid-koop_onbekend', label: 'Koop onbekend', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.KOOP_ONBEKEND },
    // eslint-disable-next-line max-len
    { id: 'betaalbaarheid-onbekend_koop_of_huur', label: 'Onbekend Koop of Huur', groepnaam: 'betaalbaarheid', field: 'betaalbaarheid', fieldValue: BetaalbaarheidEnum.ONBEKEND_KOOP_OF_HUUR, extraCls: 'line-below' },
    { id: 'sloop-sloop', label: 'Sloop', groepnaam: 'sloop', field: 'sloop', fieldValue: SloopEnum.SLOOP },
  ];

  public static getPlancategorieTable(
    planCategorieen: PlancategorieModel[],
    detailPlanningen: DetailplanningModel[],
  ): CategorieTableModel {
    const nieuwbouwCategorie = PlancategorieTableHelper.getNieuwbouwCategorie(planCategorieen);
    const nieuwbouwTotal = nieuwbouwCategorie?.totaalGepland || undefined;
    const groupTotals = new Map<string, number>();
    const rows = PlancategorieTableHelper.categorieen.map(categorieRow => {
      const planCategorie = PlancategorieTableHelper.getPlanCategorie(categorieRow, planCategorieen);
      const totalen = planCategorie?.totaalGepland || undefined;
      const gerealiseerd = planCategorie?.totaalGerealiseerd || undefined;
      const restcapaciteit = (totalen ?? 0) - (gerealiseerd ?? 0);
      const cls = [
        'group-' + categorieRow.field.toLowerCase(),
      ];
      if (categorieRow.extraCls) {
        cls.push(categorieRow.extraCls);
      }
      const disabled = nieuwbouwTotal === 0 && categorieRow.groepnaam !== 'nieuwbouw';
      if (disabled) {
        cls.push('disabled');
      }
      const row: CategorieTableRowModel = {
        id: categorieRow.id,
        cls: cls.join(' '),
        groep: categorieRow.field,
        value: categorieRow.fieldValue,
        label: categorieRow.label,
        groeplabel: categorieRow.groepnaam,
        totalen,
        total_check: 0,
        gerealiseerd,
        restcapaciteit,
        year_2024: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2024, detailPlanningen) ?? '',
        year_2025: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2025, detailPlanningen) ?? '',
        year_2026: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2026, detailPlanningen) ?? '',
        year_2027: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2027, detailPlanningen) ?? '',
        year_2028: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2028, detailPlanningen) ?? '',
        year_2029: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2029, detailPlanningen) ?? '',
        year_2030: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2030, detailPlanningen) ?? '',
        year_2031: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2031, detailPlanningen) ?? '',
        year_2032: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2032, detailPlanningen) ?? '',
        year_2033: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2033, detailPlanningen) ?? '',
        year_2034: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2034, detailPlanningen) ?? '',
        year_2035: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2035, detailPlanningen) ?? '',
        year_2036: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2036, detailPlanningen) ?? '',
        year_2037: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2037, detailPlanningen) ?? '',
        year_2038: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2038, detailPlanningen) ?? '',
        year_2039: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2039, detailPlanningen) ?? '',
        year_2040: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2040, detailPlanningen) ?? '',
        year_2041: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2041, detailPlanningen) ?? '',
        year_2042: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2042, detailPlanningen) ?? '',
        year_2043: PlancategorieTableHelper.getDetailplanningGeplandForYear(planCategorie, 2043, detailPlanningen) ?? '',
        year_2034_2038: 0,
        year_2039_2043: 0,
        years_check: 0,
        valid: false,
        disabled,
      };
      if (row.groep === 'sloop') {
        return row;
      }
      const rowTotaal = PlancategorieTableHelper.getTotalForRow(row);
      row.years_check = restcapaciteit - rowTotaal;
      row.year_2034_2038 = PlancategorieTableHelper.getTotalFor20342038(row);
      row.year_2039_2043 = PlancategorieTableHelper.getTotalFor20392043(row);
      groupTotals.set(categorieRow.field, (groupTotals.get(categorieRow.field) || 0) + (totalen ?? 0));
      return row;
    });
    const categorieGroups: CategorieGroepField[] = [ 'woningType',  'wonenEnZorg',  'flexwoningen',  'betaalbaarheid' ];
    const yearColumns: YearColumnModel[] = ColumnHelper.allYears.map<YearColumnModel>(year => {
      const yearlyTotal = PlancategorieTableHelper.getYearTotal(year, rows);
      if (!yearlyTotal) {
        return { year, valid: false };
      }
      const nieuwbouwYearTotal = yearlyTotal.nieuwbouw || 0;
      const valid = categorieGroups.every(group => nieuwbouwYearTotal === yearlyTotal[group]);
      return { year, valid };
    });
    const validatedRows = rows.map(row => {
      const totalCheck = (nieuwbouwTotal ?? 0) - (groupTotals.get(row.groep) || 0);
      return {
        ...row,
        total_check: row.groep === 'sloop' ? 0 : totalCheck,
        valid: row.groep === 'sloop' ? true : row.years_check === 0 && totalCheck === 0,
      };
    });
    return { rows: validatedRows, yearColumns };
  }

  private static getNieuwbouwCategorie(planCategorien: PlancategorieModel[]) {
    return PlancategorieTableHelper.getPlanCategorie(
      { field: "nieuwbouw", fieldValue: NieuwbouwEnum.NIEUWBOUW },
      planCategorien,
    );
  }

  private static getPlanCategorie(categorieRow: Pick<CategorieRowModel, 'field' | 'fieldValue'>, planCategorien: PlancategorieModel[]): PlancategorieModel | null {
    return planCategorien.find(categorie => {
      const value = categorie[categorieRow.field];
      return value === categorieRow.fieldValue;
    }) || null;
  }

  private static getDetailplanningForYear(
    planCategorie: PlancategorieModel | null,
    year: number,
    detailPlanningen : DetailplanningModel[],
  ) {
    if (!planCategorie) {
      return undefined;
    }
    return detailPlanningen.find(d => d.plancategorieId === planCategorie.id && d.jaartal === year);
  }

  private static getDetailplanningGeplandForYear(
    planCategorie: PlancategorieModel | null,
    year: number,
    detailPlanningen : DetailplanningModel[],
  ) {
    const detail = PlancategorieTableHelper.getDetailplanningForYear(planCategorie, year, detailPlanningen);
    return detail ? detail.aantalGepland : undefined;
  }

  private static getTotalForRow(row: CategorieTableRowModel) {
    return (typeof row.year_2024 === 'number' ? row.year_2024 : 0) +
      (typeof row.year_2025 === 'number' ? row.year_2025 : 0) +
      (typeof row.year_2026 === 'number' ? row.year_2026 : 0) +
      (typeof row.year_2027 === 'number' ? row.year_2027 : 0) +
      (typeof row.year_2028 === 'number' ? row.year_2028 : 0) +
      (typeof row.year_2029 === 'number' ? row.year_2029 : 0) +
      (typeof row.year_2030 === 'number' ? row.year_2030 : 0) +
      (typeof row.year_2031 === 'number' ? row.year_2031 : 0) +
      (typeof row.year_2032 === 'number' ? row.year_2032 : 0) +
      (typeof row.year_2033 === 'number' ? row.year_2033 : 0) +
      PlancategorieTableHelper.getTotalFor20342038(row) +
      PlancategorieTableHelper.getTotalFor20392043(row);
  }

  private static getTotalFor20342038(row: CategorieTableRowModel) {
    return (typeof row.year_2034 === 'number' ? row.year_2034 : 0) +
      (typeof row.year_2035 === 'number' ? row.year_2035 : 0) +
      (typeof row.year_2036 === 'number' ? row.year_2036 : 0) +
      (typeof row.year_2037 === 'number' ? row.year_2037 : 0) +
      (typeof row.year_2038 === 'number' ? row.year_2038 : 0);
  }

  private static getTotalFor20392043(row: CategorieTableRowModel) {
    return (typeof row.year_2039 === 'number' ? row.year_2039 : 0) +
    (typeof row.year_2040 === 'number' ? row.year_2040 : 0) +
    (typeof row.year_2041 === 'number' ? row.year_2041 : 0) +
    (typeof row.year_2042 === 'number' ? row.year_2042 : 0) +
    (typeof row.year_2043 === 'number' ? row.year_2043 : 0);
  }

  private static getYearTotal(year: YearColumn, rows: CategorieTableRowModel[]): YearTotal {
    return rows.reduce<YearTotal>((curTotal, row) => {
      const rowTotal = row[year];
      const group = row.groep;
      if (typeof rowTotal === 'number') {
        return {
          ...curTotal,
          [group]: curTotal[group] + rowTotal,
        };
      }
      return curTotal;
    }, {
      nieuwbouw: 0,
      woningType: 0,
      wonenEnZorg: 0,
      flexwoningen: 0,
      betaalbaarheid: 0,
      sloop: 0,
    });
  }

}
