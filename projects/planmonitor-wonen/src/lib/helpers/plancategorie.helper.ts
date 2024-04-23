import { BetaalbaarheidEnum, WonenEnZorgEnum, PlancategorieModel, WoningtypeEnum, DetailplanningModel } from '../models';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { FlexwoningenEnum } from '../models/flexwoningen.enum';
import { SloopEnum } from '../models/sloop.enum';

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

  public static getNewPlancategorie(): Omit<PlancategorieModel, 'ID' | 'Planregistratie_ID'> {
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
    };
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

}
