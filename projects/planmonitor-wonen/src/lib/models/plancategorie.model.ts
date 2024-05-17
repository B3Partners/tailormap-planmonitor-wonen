import { BetaalbaarheidEnum } from './betaalbaarheid.enum';
import { WoningtypeEnum } from './woningtype.enum';
import { WonenEnZorgEnum } from './wonen-en-zorg.enum';
import { NieuwbouwEnum } from './nieuwbouw.enum';
import { SloopEnum } from './sloop.enum';
import { FlexwoningenEnum } from './flexwoningen.enum';

export interface PlancategorieModel {
  planregistratieId: string;
  id: string;
  nieuwbouw: NieuwbouwEnum | null;
  woningType: WoningtypeEnum | null;
  wonenEnZorg: WonenEnZorgEnum | null;
  flexwoningen: FlexwoningenEnum | null;
  betaalbaarheid: BetaalbaarheidEnum | null;
  sloop: SloopEnum | null;
  totaalGepland: number;
  totaalGerealiseerd: number;
  creator: string | null;
  created: string | Date | null;
  editor: string | null;
  edited: string | Date | null;
  isNew?: boolean;
}
