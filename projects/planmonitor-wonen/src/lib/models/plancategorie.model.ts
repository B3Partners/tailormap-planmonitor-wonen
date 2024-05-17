import { BetaalbaarheidEnum } from './betaalbaarheid.enum';
import { WoningtypeEnum } from './woningtype.enum';
import { WonenEnZorgEnum } from './wonen-en-zorg.enum';
import { NieuwbouwEnum } from './nieuwbouw.enum';
import { SloopEnum } from './sloop.enum';
import { FlexwoningenEnum } from './flexwoningen.enum';

export interface PlancategorieModel {
  id: string;
  planregistratieId: string;
  creator: string;
  createdAt: string | Date;
  editor: string | null;
  editedAt: string | Date | null;
  nieuwbouw: NieuwbouwEnum | null;
  woningType: WoningtypeEnum | null;
  wonenEnZorg: WonenEnZorgEnum | null;
  flexwoningen: FlexwoningenEnum | null;
  betaalbaarheid: BetaalbaarheidEnum | null;
  sloop: SloopEnum | null;
  totaalGepland: number;
  totaalGerealiseerd: number;
  isNew?: boolean;
}
