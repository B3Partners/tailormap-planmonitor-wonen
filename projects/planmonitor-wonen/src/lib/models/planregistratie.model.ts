import { VertrouwelijkheidEnum } from './vertrouwelijkheid.enum';
import { OpdrachtgeverEnum } from './opdrachtgever.enum';
import { PlantypeEnum } from './plantype.enum';
import { ProjectstatusEnum } from './projectstatus.enum';
import { KnelpuntenMeerkeuzeEnum } from './knelpunten-meerkeuze.enum';
import { KnelpuntenPlantypeEnum } from './knelpunten-plantype.enum';
import { StatusPlanologischEnum } from './status-planologisch.enum';
import { WoonmilieuABF5Enum } from './woonmilieu-abf5.enum';
import { WoonmilieuABF13Enum } from './woonmilieu-abf13.enum';
import { EigendomEnum } from './eigendom.enum';

export interface PlanregistratieModel {
  ID: string;
  GEOM: string;
  Creator: string;
  Created: string | Date;
  Editor: string | null;
  Edited: string | Date | null;
  Plannaam: string;
  Provincie: string;
  Gemeente: string;
  Regio: string;
  Plaatsnaam: string;
  Vertrouwelijkheid: VertrouwelijkheidEnum;
  Opdrachtgever_Type: OpdrachtgeverEnum;
  Opdrachtgever_Naam: string;
  Jaar_Start_Project: number;
  Oplevering_Eerste: number;
  Oplevering_Laatste: number;
  Opmerkingen: string;
  Plantype: PlantypeEnum;
  Bestemmingsplan: string;
  Status_Project: ProjectstatusEnum;
  Status_Planologisch: StatusPlanologischEnum;
  Knelpunten_Meerkeuze: KnelpuntenMeerkeuzeEnum;
  Regionale_Planlijst: EigendomEnum;
  Toelichting_Knelpunten: KnelpuntenPlantypeEnum;
  Flexwoningen: number;
  Levensloopbestendig_Ja: number;
  Levensloopbestendig_Nee: number;
  Beoogd_Woonmilieu_ABF5: WoonmilieuABF5Enum;
  Beoogd_Woonmilieu_ABF13: WoonmilieuABF13Enum;
  Aantal_Studentenwoningen: number;
  Toelichting_Kwalitatief: string;
}