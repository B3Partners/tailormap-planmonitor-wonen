import { DetailplanningModel, PlancategorieModel, PlanregistratieModel, VertrouwelijkheidEnum } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class PlanMonitorModelHelper {

  public static getNewPlanregistratie(initialData: Partial<PlanregistratieModel>): PlanregistratieModel {
    return {
      id: uuidv4(),
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
      sleutelproject: null,
      isNew: true,
      ...initialData,
    };
  }

  public static getNewPlancategorie(initialData: Partial<PlancategorieModel> & Pick<PlancategorieModel, 'planregistratieId'>): PlancategorieModel {
    return {
      id: uuidv4(),
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
      id: uuidv4(),
      creator: '',
      createdAt: new Date(),
      editor: null,
      editedAt: null,
      ...initialData,
    };
  }

}
