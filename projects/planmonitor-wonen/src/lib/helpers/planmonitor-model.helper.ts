import {
  DetailplanningModel, EigendomEnum, KnelpuntenMeerkeuzeEnum, KnelpuntenPlantypeEnum, OpdrachtgeverEnum, PlancategorieModel,
  PlanregistratieModel, PlantypeEnum,
  ProjectstatusEnum,
  StatusPlanologischEnum,
  VertrouwelijkheidEnum,
  WoonmilieuABF13Enum, WoonmilieuABF5Enum,
} from '../models';
import { v4 as uuid_v4 } from '@lukeed/uuid/secure';

export class PlanMonitorModelHelper {

  public static getNewPlanregistratie(initialData: Partial<PlanregistratieModel>): PlanregistratieModel {
    return {
      ID: uuid_v4(),
      GEOM: "",
      Created: new Date(),
      Creator: "",
      Edited: null,
      Editor: null,
      Opdrachtgever_Naam: "",
      Plannaam: "",
      Bestemmingsplan: "",
      Gemeente: "",
      Regio: "",
      Plaatsnaam: "",
      Provincie: "",
      Opmerkingen: "",
      Levensloopbestendig_Ja: 0,
      Levensloopbestendig_Nee: 0,
      Oplevering_Eerste: 0,
      Oplevering_Laatste: 0,
      Flexwoningen: 0,
      Aantal_Studentenwoningen: 0,
      Jaar_Start_Project: (new Date()).getFullYear(),
      Plantype: PlantypeEnum.UITBREIDING_UITLEG,
      Beoogd_Woonmilieu_ABF13: WoonmilieuABF13Enum.DORPS,
      Beoogd_Woonmilieu_ABF5: WoonmilieuABF5Enum.DORPS,
      Opdrachtgever_Type: OpdrachtgeverEnum.GEMEENTE,
      Knelpunten_Meerkeuze: KnelpuntenMeerkeuzeEnum.ANDERS,
      Regionale_Planlijst: EigendomEnum.ONBEKEND,
      Vertrouwelijkheid: VertrouwelijkheidEnum.GEMEENTE,
      Status_Planologisch: StatusPlanologischEnum.IN_VOORBEREIDING,
      Status_Project: ProjectstatusEnum.ONBEKEND,
      Toelichting_Knelpunten: KnelpuntenPlantypeEnum.ONBEKEND,
      Toelichting_Kwalitatief: "",
      IsNew: true,
      ...initialData,
    };
  }

  public static getNewPlancategorie(initialData: Partial<PlancategorieModel> & Pick<PlancategorieModel, 'Planregistratie_ID'>): PlancategorieModel {
    return {
      ID: uuid_v4(),
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

  public static getNewDetailplanning(initialData: Pick<DetailplanningModel, 'Plancategorie_ID' | 'Jaartal' | 'Aantal_Gepland'>): DetailplanningModel {
    return {
      ID: uuid_v4(),
      IsNew: true,
      Created: new Date(),
      Creator: '',
      Editor: null,
      Edited: null,
      ...initialData,
    };
  }

}
