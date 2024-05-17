import {
  DetailplanningModel, EigendomEnum, KnelpuntenMeerkeuzeEnum, KnelpuntenPlantypeEnum, OpdrachtgeverEnum, PlancategorieModel,
  PlanregistratieModel, PlantypeEnum,
  ProjectstatusEnum,
  StatusPlanologischEnum,
  VertrouwelijkheidEnum,
  WoonmilieuAbf13Enum, WoonmilieuAbf5Enum,
} from '../models';
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
      bestemmingsplan: "",
      gemeente: "",
      regio: "",
      plaatsnaam: "",
      provincie: "",
      opmerkingen: "",
      levensloopbestendigJa: 0,
      levensloopbestendigNee: 0,
      opleveringEerste: 0,
      opleveringLaatste: 0,
      flexwoningen: 0,
      aantalStudentenwoningen: 0,
      jaarStartProject: (new Date()).getFullYear(),
      plantype: PlantypeEnum.UITBREIDING_UITLEG,
      beoogdWoonmilieuAbf13: WoonmilieuAbf13Enum.DORPS,
      beoogdWoonmilieuAbf5: WoonmilieuAbf5Enum.DORPS,
      opdrachtgeverType: OpdrachtgeverEnum.GEMEENTE,
      knelpuntenMeerkeuze: KnelpuntenMeerkeuzeEnum.ANDERS,
      regionalePlanlijst: EigendomEnum.ONBEKEND,
      vertrouwelijkheid: VertrouwelijkheidEnum.GEMEENTE,
      statusPlanologisch: StatusPlanologischEnum.IN_VOORBEREIDING,
      statusProject: ProjectstatusEnum.ONBEKEND,
      toelichtingKnelpunten: KnelpuntenPlantypeEnum.ONBEKEND,
      toelichtingKwalitatief: "",
      isNew: true,
      ...initialData,
    };
  }

  public static getNewPlancategorie(initialData: Partial<PlancategorieModel> & Pick<PlancategorieModel, 'planregistratieId'>): PlancategorieModel {
    return {
      id: uuid_v4(),
      woningType: null,
      nieuwbouw: null,
      sloop: null,
      betaalbaarheid: null,
      flexwoningen: null,
      wonenEnZorg: null,
      totaalGepland: 0,
      totaalGerealiseerd: 0,
      creator: null,
      created: null,
      editor: null,
      edited: null,
      ...initialData,
    };
  }

  public static getNewDetailplanning(initialData: Pick<DetailplanningModel, 'plancategorieId' | 'jaartal' | 'aantalGepland'>): DetailplanningModel {
    return {
      id: uuid_v4(),
      isNew: true,
      created: new Date(),
      creator: '',
      editor: null,
      edited: null,
      ...initialData,
    };
  }

}
