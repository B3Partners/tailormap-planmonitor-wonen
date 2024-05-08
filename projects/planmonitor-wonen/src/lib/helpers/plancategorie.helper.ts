import { BetaalbaarheidEnum, DetailplanningModel, PlancategorieModel, WonenEnZorgEnum, WoningtypeEnum } from '../models';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { FlexwoningenEnum } from '../models/flexwoningen.enum';
import { SloopEnum } from '../models/sloop.enum';
import { CategorieTableRowModel } from '../models/categorie-table-row.model';

export interface CategorieRowModel {
  id: string;
  label: string;
  groepnaam: string;
  field: keyof PlancategorieModel;
  fieldValue: string;
}

export class PlancategorieHelper {

  public static categorieen: CategorieRowModel[] = [
    { id: 'nieuwbouw-nieuwbouw', label: 'Nieuwbouw', groepnaam: 'nieuwbouw', field: "Nieuwbouw", fieldValue: NieuwbouwEnum.NIEUWBOUW },
    { id: 'woningtype-eengezins', label: 'Eengezins', groepnaam: 'woningtype', field: 'Woningtype', fieldValue: WoningtypeEnum.EENGEZINS },
    { id: 'woningtype-meergezins', label: 'Meergezins', groepnaam: 'woningtype', field: 'Woningtype', fieldValue: WoningtypeEnum.MEERGEZINS },
    { id: 'woningtype-onbekend', label: 'Onbekend', groepnaam: 'woningtype', field: 'Woningtype', fieldValue: WoningtypeEnum.ONBEKEND },
    { id: 'wonenenzorg-nultreden', label: 'Nultreden', groepnaam: 'wonen en zorg', field: 'WonenenZorg', fieldValue: WonenEnZorgEnum.NULTREDEN },
    { id: 'wonenenzorg-geclusterd', label: 'Geclusterd', groepnaam: 'wonen en zorg', field: 'WonenenZorg', fieldValue: WonenEnZorgEnum.GECLUSTERD },
    { id: 'wonenenzorg-zorggeschikt', label: 'Zorggeschikt', groepnaam: 'wonen en zorg', field: 'WonenenZorg', fieldValue: WonenEnZorgEnum.ZORGGESCHIKT },
    { id: 'wonenenzorg-onbekend', label: 'Onbekend', groepnaam: 'wonen en zorg', field: 'WonenenZorg', fieldValue: WonenEnZorgEnum.ONBEKEND },
    { id: 'wonenenzorg-regulier', label: 'Regulier', groepnaam: 'wonen en zorg', field: 'WonenenZorg', fieldValue: WonenEnZorgEnum.REGULIER },
    { id: 'flexwoningen-flexwoningen', label: 'Flexwoningen', groepnaam: 'flexwoningen', field: 'Flexwoningen', fieldValue: FlexwoningenEnum.FLEXWONINGEN },
    { id: 'flexwoningen-regulier_permanent', label: 'Regulier permanent', groepnaam: 'flexwoningen', field: 'Flexwoningen', fieldValue: FlexwoningenEnum.REGULIER_PERMANENT },
    { id: 'betaalbaarheid-sociale_huur', label: 'Sociale huur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.SOCIALE_HUUR },
    { id: 'betaalbaarheid-huur_middenhuur', label: 'Huur middenhuur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.HUUR_MIDDENHUUR },
    { id: 'betaalbaarheid-huur_dure_huur', label: 'Huur dure huur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.HUUR_DURE_HUUR },
    { id: 'betaalbaarheid-huur_onbekend', label: 'Huur onbekend', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.HUUR_ONBEKEND },
    // eslint-disable-next-line max-len
    { id: 'betaalbaarheid-koop_betaalbare_koop', label: 'Koop betaalbare koop', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.KOOP_BETAALBARE_KOOP },
    { id: 'betaalbaarheid-koop_dure_koop', label: 'Koop dure koop', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.KOOP_DURE_KOOP },
    { id: 'betaalbaarheid-koop_onbekend', label: 'Koop onbekend', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.KOOP_ONBEKEND },
    // eslint-disable-next-line max-len
    { id: 'betaalbaarheid-onbekend_koop_of_huur', label: 'Onbekend Koop of Huur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid', fieldValue: BetaalbaarheidEnum.ONBEKEND_KOOP_OF_HUUR },
    { id: 'sloop-sloop', label: 'Sloop', groepnaam: 'sloop', field: 'Sloop', fieldValue: SloopEnum.SLOOP },
  ];

  public static getNewPlancategorie(initialData: Partial<PlancategorieModel> & Pick<PlancategorieModel, 'ID' | 'Planregistratie_ID'>): PlancategorieModel {
    return {
      Woningtype: null,
      Nieuwbouw: null,
      Sloop: null,
      Betaalbaarheid: null,
      Flexwoningen: null,
      WonenenZorg: null,
      Totaal_Gepland: 0,
      Totaal_Gerealiseerd: 0,
      Creator: null,
      Created: null,
      Editor: null,
      Edited: null,
      ...initialData,
    };
  }

  public static getPlancategorieTable(
    planCategorieen: PlancategorieModel[],
    detailPlanningen: DetailplanningModel[],
  ): CategorieTableRowModel[] {
    const nieuwbouwCategorie = PlancategorieHelper.getNieuwbouwCategorie(planCategorieen);
    const nieuwbouwTotal = nieuwbouwCategorie?.Totaal_Gepland || 0;
    const groupTotals = new Map<string, number>();
    const rows = PlancategorieHelper.categorieen.map(categorieRow => {
      const planCategorie = PlancategorieHelper.getPlanCategorie(categorieRow, planCategorieen);
      const totalen = planCategorie?.Totaal_Gepland || 0;
      const gerealiseerd = planCategorie?.Totaal_Gerealiseerd || 0;
      const restcapaciteit = totalen - gerealiseerd;
      const row: CategorieTableRowModel = {
        id: categorieRow.id,
        cls: 'group-' + categorieRow.field.toLowerCase(),
        groep: categorieRow.field,
        value: categorieRow.fieldValue,
        label: categorieRow.label,
        groeplabel: categorieRow.groepnaam,
        totalen,
        total_check: 0,
        gerealiseerd,
        restcapaciteit,
        year_2024: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2024, detailPlanningen) ?? '',
        year_2025: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2025, detailPlanningen) ?? '',
        year_2026: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2026, detailPlanningen) ?? '',
        year_2027: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2027, detailPlanningen) ?? '',
        year_2028: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2028, detailPlanningen) ?? '',
        year_2029: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2029, detailPlanningen) ?? '',
        year_2030: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2030, detailPlanningen) ?? '',
        year_2031: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2031, detailPlanningen) ?? '',
        year_2032: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2032, detailPlanningen) ?? '',
        year_2033: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2033, detailPlanningen) ?? '',
        years_check: 0,
        valid: false,
      };
      if (row.groep === 'Sloop') {
        return row;
      }
      const rowTotaal = PlancategorieHelper.getTotalForRow(row);
      row.years_check = restcapaciteit - rowTotaal;
      groupTotals.set(categorieRow.field, (groupTotals.get(categorieRow.field) || 0) + totalen);
      return row;
    });
    return rows.map(row => {
      const totalCheck = nieuwbouwTotal - (groupTotals.get(row.groep) || 0);
      return {
        ...row,
        total_check: row.groep === 'Sloop' ? 0 : totalCheck,
        valid: row.groep === 'Sloop' ? true : row.years_check === 0 && totalCheck === 0,
      };
    });
  }

  public static getNieuwbouwCategorie(planCategorien: PlancategorieModel[]) {
    return PlancategorieHelper.getPlanCategorie(
      { field: "Nieuwbouw", fieldValue: NieuwbouwEnum.NIEUWBOUW },
      planCategorien,
    );
  }

  public static getPlanCategorie(categorieRow: Pick<CategorieRowModel, 'field' | 'fieldValue'>, planCategorien: PlancategorieModel[]): PlancategorieModel | null {
    return planCategorien.find(categorie => {
      const value = categorie[categorieRow.field];
      return value === categorieRow.fieldValue;
    }) || null;
  }

  public static getDetailplanningForYear(
    planCategorie: PlancategorieModel | null,
    year: number,
    detailPlanningen : DetailplanningModel[],
  ) {
    if (!planCategorie) {
      return undefined;
    }
    return detailPlanningen.find(d => d.Plancategorie_ID === planCategorie.ID && d.Jaartal === year);
  }

  public static getDetailplanningGeplandForYear(
    planCategorie: PlancategorieModel | null,
    year: number,
    detailPlanningen : DetailplanningModel[],
  ) {
    const detail = PlancategorieHelper.getDetailplanningForYear(planCategorie, year, detailPlanningen);
    return detail ? detail.Aantal_Gepland : undefined;
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
      (typeof row.year_2033 === 'number' ? row.year_2033 : 0);
  }

}