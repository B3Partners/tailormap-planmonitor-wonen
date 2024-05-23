import { DetailplanningModel, PlancategorieModel, PlanregistratieModel, VertrouwelijkheidEnum } from '../models';
import { v4 as uuid_v4 } from '@lukeed/uuid/secure';

export class PlanMonitorModelHelper {

  public static getNewPlanregistratie(initialData: Partial<PlanregistratieModel>): PlanregistratieModel {
    return {
      id: uuid_v4(),
      geometrie: "",
      createdAt: new Date(),
      creator: "",
      editedAt: null,
      editor: null,
      opdrachtgeverNaam: "",
      planNaam: "",
      gemeente: "",
      regio: "",
      plaatsnaam: "",
      provincie: "",
      opmerkingen: "",
      aantalStudentenwoningen: 0,
      plantype: null,
      beoogdWoonmilieuAbf13: null,
      opdrachtgeverType: null,
      knelpuntenMeerkeuze: null,
      vertrouwelijkheid: VertrouwelijkheidEnum.OPENBAAR,
      statusPlanologisch: null,
      statusProject: null,
      ...initialData,
    };
  }

  public static getNewPlancategorie(initialData: Partial<PlancategorieModel> & Pick<PlancategorieModel, 'planregistratieId'>): PlancategorieModel {
    return {
      id: uuid_v4(),
      creator: '',
      createdAt: new Date(),
      editor: null,
      editedAt: null,
      woningType: null,
      nieuwbouw: null,
      sloop: null,
      betaalbaarheid: null,
      flexwoningen: null,
      wonenEnZorg: null,
      totaalGepland: 0,
      totaalGerealiseerd: 0,
      ...initialData,
    };
  }

  public static getNewDetailplanning(initialData: Pick<DetailplanningModel, 'plancategorieId' | 'jaartal' | 'aantalGepland'>): DetailplanningModel {
    return {
      id: uuid_v4(),
      creator: '',
      createdAt: new Date(),
      editor: null,
      editedAt: null,
      ...initialData,
    };
  }

}
