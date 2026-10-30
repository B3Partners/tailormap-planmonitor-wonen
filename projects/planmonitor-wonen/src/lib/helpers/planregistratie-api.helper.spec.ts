import { describe, it, expect } from 'vitest';
import { PlanregistratieApiHelper } from './planregistratie-api.helper';
import { PlanMonitorModelHelper } from './planmonitor-model.helper';
import { BetaalbaarheidEnum, WoningtypeEnum } from '../models';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { SloopEnum } from '../models/sloop.enum';
import { PlanregistratieApiModel } from '../models/planregistratie-api.model';

describe('PlanregistratieApiHelper', () => {

  const planregistratie = PlanMonitorModelHelper.getNewPlanregistratie({ planNaam: 'Plan', isNew: undefined });

  const apiModel: PlanregistratieApiModel = {
    ...planregistratie,
    aantallen: {
      bruto: { gepland: 10, gerealiseerd: 2, perJaar: { 2025: 3, 2026: 5 } },
      sloop: { gepland: 1, gerealiseerd: 0, perJaar: {} },
      woningType: {
        [WoningtypeEnum.EENGEZINS]: { gepland: 4, gerealiseerd: 2, perJaar: { 2025: 3, 2026: 1 } },
        [WoningtypeEnum.MEERGEZINS]: { gepland: 6, gerealiseerd: 0, perJaar: { 2026: 4 } },
      },
      wonenEnZorg: {},
      flexwoningen: {},
      betaalbaarheid: {
        [BetaalbaarheidEnum.SOCIALE_HUUR]: { gepland: 10, gerealiseerd: 2, perJaar: {} },
      },
    },
  };

  it('converts aantallen to linked plancategorieen and detailplanningen', () => {
    const result = PlanregistratieApiHelper.fromApiModel(apiModel);
    expect(result.planregistratie).toEqual(planregistratie);
    expect(result.plancategorieen.length).toBe(5);
    expect(result.plancategorieen.every(c => c.planregistratieId === planregistratie.id)).toBe(true);

    const nieuwbouw = result.plancategorieen.find(c => c.nieuwbouw === NieuwbouwEnum.NIEUWBOUW);
    expect(nieuwbouw?.totaalGepland).toBe(10);
    expect(nieuwbouw?.totaalGerealiseerd).toBe(2);
    expect(result.detailplanningen.filter(d => d.plancategorieId === nieuwbouw?.id).map(d => [ d.jaartal, d.aantalGepland ]))
      .toEqual([[ 2025, 3 ], [ 2026, 5 ]]);

    expect(result.plancategorieen.find(c => c.sloop === SloopEnum.SLOOP)?.totaalGepland).toBe(1);
    const meergezins = result.plancategorieen.find(c => c.woningType === WoningtypeEnum.MEERGEZINS);
    expect(meergezins?.totaalGepland).toBe(6);
    expect(meergezins?.nieuwbouw).toBeNull();
    expect(result.plancategorieen.find(c => c.betaalbaarheid === BetaalbaarheidEnum.SOCIALE_HUUR)?.totaalGepland).toBe(10);
  });

  it('handles a planregistratie without aantallen', () => {
    const result = PlanregistratieApiHelper.fromApiModel(planregistratie);
    expect(result.plancategorieen).toEqual([]);
    expect(result.detailplanningen).toEqual([]);
  });

  it('converts back to the same aantallen', () => {
    const result = PlanregistratieApiHelper.toApiModel(PlanregistratieApiHelper.fromApiModel(apiModel));
    expect(result).toEqual(apiModel);
  });

});
