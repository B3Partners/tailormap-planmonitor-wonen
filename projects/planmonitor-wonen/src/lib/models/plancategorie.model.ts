import { BetaalbaarheidEnum } from './betaalbaarheid.enum';
import { WoningtypeEnum } from './woningtype.enum';
import { LevensloopEnum } from './levensloop.enum';
import { ClassificatieEnum } from './classificatie.enum';

export interface PlancategorieModel {
  Planregistratie_ID: string;
  ID: string;
  Totaal_Gepland: number;
  Totaal_Gerealiseerd: number;
  Classificatie: ClassificatieEnum;
  Levensloop_Bestendigheid: LevensloopEnum;
  Created: string | Date;
  Woningtype: WoningtypeEnum;
  Betaalbaarheid: BetaalbaarheidEnum;
  Creator: string;
  Edited: string | Date | null;
  Editor: string | null;
}
