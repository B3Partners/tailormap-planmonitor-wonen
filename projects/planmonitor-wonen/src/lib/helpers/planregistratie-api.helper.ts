import { DetailplanningModel, PlancategorieModel, PlanregistratieModel, PlanregistratieSaveModel } from '../models';
import { AantalApiModel, AantallenApiModel, PlanregistratieApiModel } from '../models/planregistratie-api.model';
import { PlanMonitorModelHelper } from './planmonitor-model.helper';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { SloopEnum } from '../models/sloop.enum';

type CategorieMapGroep = keyof Pick<AantallenApiModel, 'woningType' | 'wonenEnZorg' | 'flexwoningen' | 'betaalbaarheid'>;

const CATEGORIE_MAP_GROEPEN: CategorieMapGroep[] = [ 'woningType', 'wonenEnZorg', 'flexwoningen', 'betaalbaarheid' ];

/**
 * Converts between the aantallen of a planregistratie in the API and the separate plancategorieen and detailplanningen
 * lists (linked by generated ids) used in the frontend.
 */
export class PlanregistratieApiHelper {

  public static toApiModel(saveModel: PlanregistratieSaveModel): PlanregistratieApiModel {
    const aantallen: AantallenApiModel = {
      bruto: null,
      sloop: null,
      woningType: {},
      wonenEnZorg: {},
      flexwoningen: {},
      betaalbaarheid: {},
    };
    saveModel.plancategorieen.forEach(categorie => {
      const perJaar: Record<string, number> = {};
      saveModel.detailplanningen
        .filter(d => d.plancategorieId === categorie.id)
        .forEach(d => perJaar[d.jaartal] = d.aantalGepland);
      const aantal: AantalApiModel = { gepland: categorie.totaalGepland, gerealiseerd: categorie.totaalGerealiseerd, perJaar };
      if (categorie.nieuwbouw) {
        aantallen.bruto = aantal;
      } else if (categorie.sloop) {
        aantallen.sloop = aantal;
      } else {
        const groep = CATEGORIE_MAP_GROEPEN.find(g => categorie[g]);
        const value = groep ? categorie[groep] : null;
        if (groep && value) {
          aantallen[groep] = { ...aantallen[groep], [value]: aantal };
        }
      }
    });
    return { ...saveModel.planregistratie, aantallen };
  }

  public static fromApiModel(apiModel: PlanregistratieApiModel): {
    planregistratie: PlanregistratieModel;
    plancategorieen: PlancategorieModel[];
    detailplanningen: DetailplanningModel[];
  } {
    const { aantallen, ...planregistratie } = apiModel;
    const plancategorieen: PlancategorieModel[] = [];
    const detailplanningen: DetailplanningModel[] = [];
    const add = (categorie: Partial<PlancategorieModel>, aantal: AantalApiModel | null | undefined) => {
      if (!aantal) {
        return;
      }
      const plancategorie = PlanMonitorModelHelper.getNewPlancategorie({
        ...categorie,
        planregistratieId: planregistratie.id,
        totaalGepland: aantal.gepland,
        totaalGerealiseerd: aantal.gerealiseerd,
      });
      plancategorieen.push(plancategorie);
      Object.entries(aantal.perJaar || {}).forEach(([ jaartal, aantalGepland ]) => {
        detailplanningen.push(PlanMonitorModelHelper.getNewDetailplanning({ plancategorieId: plancategorie.id, jaartal: +jaartal, aantalGepland }));
      });
    };
    if (aantallen) {
      add({ nieuwbouw: NieuwbouwEnum.NIEUWBOUW }, aantallen.bruto);
      add({ sloop: SloopEnum.SLOOP }, aantallen.sloop);
      CATEGORIE_MAP_GROEPEN.forEach(groep => {
        Object.entries(aantallen[groep] || {}).forEach(([ value, aantal ]) => add({ [groep]: value }, aantal));
      });
    }
    return { planregistratie, plancategorieen, detailplanningen };
  }

}
