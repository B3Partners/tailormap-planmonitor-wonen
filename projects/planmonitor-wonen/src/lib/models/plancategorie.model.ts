import { BetaalbaarheidEnum } from './betaalbaarheid.enum';
import { WoningtypeEnum } from './woningtype.enum';
import { WonenEnZorgEnum } from './wonen-en-zorg.enum';
import { NieuwbouwEnum } from './nieuwbouw.enum';
import { SloopEnum } from './sloop.enum';
import { FlexwoningenEnum } from './flexwoningen.enum';

export interface PlancategorieModel {
  Planregistratie_ID: string;
  ID: string;
  Nieuwbouw: NieuwbouwEnum | null;
  Woningtype: WoningtypeEnum | null;
  WonenenZorg: WonenEnZorgEnum | null;
  Flexwoningen: FlexwoningenEnum | null;
  Betaalbaarheid: BetaalbaarheidEnum | null;
  Sloop: SloopEnum | null;
  Totaal_Gepland: number;
  Totaal_Gerealiseerd: number;
  Creator: string | null;
  Created: string | Date | null;
  Editor: string | null;
  Edited: string | Date | null;
  IsNew?: boolean;
}
