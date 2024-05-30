import { VertrouwelijkheidEnum } from './vertrouwelijkheid.enum';
import { OpdrachtgeverEnum } from './opdrachtgever.enum';
import { PlantypeEnum } from './plantype.enum';
import { ProjectstatusEnum } from './projectstatus.enum';
import { KnelpuntenMeerkeuzeEnum } from './knelpunten-meerkeuze.enum';
import { StatusPlanologischEnum } from './status-planologisch.enum';
import { WoonmilieuAbf13Enum } from './woonmilieu-abf13.enum';

export interface PlanregistratieModel {
  id: string;
  geometrie: string;
  creator: string;
  createdAt: string | Date;
  editor: string | null;
  editedAt: string | Date | null;
  planNaam: string;
  provincie: string;
  gemeente: string;
  regio: string;
  plaatsnaam: string;
  vertrouwelijkheid: VertrouwelijkheidEnum;
  opdrachtgeverType: OpdrachtgeverEnum | null;
  opdrachtgeverNaam: string;
  opmerkingen: string;
  plantype: PlantypeEnum | null;
  statusProject: ProjectstatusEnum | null;
  statusPlanologisch: StatusPlanologischEnum | null;
  knelpuntenMeerkeuze: KnelpuntenMeerkeuzeEnum | null;
  beoogdWoonmilieuAbf13: WoonmilieuAbf13Enum | null;
  aantalStudentenwoningen: number;
  sleutelproject: boolean | null;
}
