import { PlanregistratieModel } from './planregistratie.model';
import { WoningtypeEnum } from './woningtype.enum';
import { WonenEnZorgEnum } from './wonen-en-zorg.enum';
import { FlexwoningenEnum } from './flexwoningen.enum';
import { BetaalbaarheidEnum } from './betaalbaarheid.enum';

// The API has the numbers of dwellings of a planregistratie as nested objects keyed by categorie value and year. A
// categorie or year left out is not filled in, 0 is filled in as zero. Categories not filled in are left out by the API.

export interface AantalApiModel {
  gepland: number;
  gerealiseerd: number;
  perJaar: Record<string, number>;
}

export interface AantallenApiModel {
  bruto?: AantalApiModel | null;
  sloop?: AantalApiModel | null;
  woningType?: Partial<Record<WoningtypeEnum, AantalApiModel>>;
  wonenEnZorg?: Partial<Record<WonenEnZorgEnum, AantalApiModel>>;
  flexwoningen?: Partial<Record<FlexwoningenEnum, AantalApiModel>>;
  betaalbaarheid?: Partial<Record<BetaalbaarheidEnum, AantalApiModel>>;
}

export interface PlanregistratieApiModel extends PlanregistratieModel {
  aantallen?: AantallenApiModel;
}
