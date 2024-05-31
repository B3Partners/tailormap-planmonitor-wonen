/* eslint-disable max-len */
import { PlanmonitorWonenApiServiceModel, PlanregistratieDetails } from './planmonitor-wonen-api.service.model';
import { Observable, of } from 'rxjs';
import {
  AutofillDataModel,
  BetaalbaarheidEnum, KnelpuntenMeerkeuzeEnum, OpdrachtgeverEnum,
  PlanregistratieModel, PlanregistratieSaveModel, PlantypeEnum, ProjectstatusEnum, StatusPlanologischEnum, VertrouwelijkheidEnum,
  WonenEnZorgEnum,
  WoningtypeEnum, WoonmilieuAbf13Enum,
} from '../models';
import { Injectable } from '@angular/core';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { FlexwoningenEnum } from '../models/flexwoningen.enum';
import { PlanMonitorModelHelper } from '../helpers/planmonitor-model.helper';
import { GemeenteModel } from '../models/gemeente.model';

@Injectable()
export class PlanmonitorWonenApiMockService implements PlanmonitorWonenApiServiceModel {

  public getGemeentes$(): Observable<GemeenteModel[]> {
    return of([]);
  }

  public getPlanregistraties$(): Observable<PlanregistratieModel[]> {
    const registraties: PlanregistratieModel[] = [{
      id: "1",
      geometrie: "POLYGON ((27791.55972066056 397785.16112066095, 24697.205902478643 393790.63164628064, 26778.86210743738 391483.93152727233, 30548.347667768074 395084.6341520658, 30548.347667768074 395084.6341520658, 27791.55972066056 397785.16112066095))",
      creator: "test",
      createdAt: "2024-04-17",
      editor: "test",
      editedAt: "2024-04-17",
      planNaam: "Plan 1",
      provincie: "Zeeland",
      gemeente: "Middelburg",
      regio: "Walcheren",
      plaatsnaam: "Middelburg",
      vertrouwelijkheid: VertrouwelijkheidEnum.GEMEENTE,
      opdrachtgeverType: OpdrachtgeverEnum.GEMEENTE,
      opdrachtgeverNaam: "Middelburg",
      opmerkingen: "",
      plantype: PlantypeEnum.HERSTRUCTURERING,
      statusProject: ProjectstatusEnum.VOORBEREIDING,
      statusPlanologisch: StatusPlanologischEnum.IN_VOORBEREIDING,
      knelpuntenMeerkeuze: KnelpuntenMeerkeuzeEnum.BEREIKBAARHEID,
      beoogdWoonmilieuAbf13: WoonmilieuAbf13Enum.CENTRUM_DORPS,
      aantalStudentenwoningen: 70,
      sleutelproject: false,
    }, {
      id: "2",
      geometrie: "POLYGON ((25814.84 390517.68, 28825.4 390410.16, 28449.08 388447.92, 26056.76 388743.6, 25814.84 390517.68))",
      creator: "test",
      createdAt: "2024-04-17",
      editor: "test",
      editedAt: "2024-04-17",
      planNaam: "Plan 2",
      provincie: "Zeeland",
      gemeente: "Vlissingen",
      regio: "Walcheren",
      plaatsnaam: "Vlissingen",
      vertrouwelijkheid: VertrouwelijkheidEnum.GEMEENTE,
      opdrachtgeverType: OpdrachtgeverEnum.GEMEENTE,
      opdrachtgeverNaam: "Vlissingen",
      opmerkingen: "",
      plantype: PlantypeEnum.TRANSFORMATIEGEBIED,
      statusProject: ProjectstatusEnum.START,
      statusPlanologisch: StatusPlanologischEnum.VASTGESTELD,
      knelpuntenMeerkeuze: KnelpuntenMeerkeuzeEnum.ANDERS,
      beoogdWoonmilieuAbf13: WoonmilieuAbf13Enum.CENTRUM_DORPS,
      aantalStudentenwoningen: 80,
      sleutelproject: false,
    }];
    return of(registraties);
  }

  public getPlandetails$(id: string): Observable<PlanregistratieDetails> {
    if (id === "2") {
      return of({
        plancategorieen: [
          PlanMonitorModelHelper.getNewPlancategorie({ id: "2_1", planregistratieId: "2",	woningType: WoningtypeEnum.EENGEZINS, totaalGepland: 80, totaalGerealiseerd: 20 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "2_2", planregistratieId: "2",	woningType: WoningtypeEnum.MEERGEZINS, totaalGepland: 50, totaalGerealiseerd: 10 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "2_3", planregistratieId: "2",	woningType: WoningtypeEnum.ONBEKEND, totaalGepland: 25, totaalGerealiseerd: 15 }),
        ],
        detailplanningen: [
          PlanMonitorModelHelper.getNewDetailplanning({ plancategorieId: "2_1", aantalGepland: 80, jaartal: 2026 }),
          PlanMonitorModelHelper.getNewDetailplanning({ plancategorieId: "2_2", aantalGepland: 50, jaartal: 2026 }),
          PlanMonitorModelHelper.getNewDetailplanning({ plancategorieId: "2_3", aantalGepland: 25, jaartal: 2026 }),
        ],
      });
    }
    if (id === "1") {
      return of({
        plancategorieen: [
          PlanMonitorModelHelper.getNewPlancategorie({ id: "1_NieuwbouwEnum_NIEUWBOUW", planregistratieId: "1",	nieuwbouw: NieuwbouwEnum.NIEUWBOUW, totaalGepland: 210, totaalGerealiseerd: 0 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "1_WoningtypeEnum_EENGEZINS", planregistratieId: "1",	woningType: WoningtypeEnum.EENGEZINS, totaalGepland: 120, totaalGerealiseerd: 0 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "1_WoningtypeEnum_MEERGEZINS", planregistratieId: "1",	woningType: WoningtypeEnum.MEERGEZINS, totaalGepland: 80, totaalGerealiseerd: 0 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "1_WoningtypeEnum_ONBEKEND", planregistratieId: "1",	woningType: WoningtypeEnum.ONBEKEND, totaalGepland: 10, totaalGerealiseerd: 0 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "1_FlexwoningenEnum_FLEXWONINGEN", planregistratieId: "1",	flexwoningen: FlexwoningenEnum.FLEXWONINGEN, totaalGepland: 210, totaalGerealiseerd: 0 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "1_WonenEnZorgEnum_ZORGGESCHIKT", planregistratieId: "1",	wonenEnZorg: WonenEnZorgEnum.ZORGGESCHIKT, totaalGepland: 210, totaalGerealiseerd: 0 }),
          PlanMonitorModelHelper.getNewPlancategorie({ id: "1_BetaalbaarheidEnum_ONBEKEND_KOOP_OF_HUUR", planregistratieId: "1",	betaalbaarheid: BetaalbaarheidEnum.ONBEKEND_KOOP_OF_HUUR, totaalGepland: 210, totaalGerealiseerd: 0 }),
        ],
        detailplanningen: [
          PlanMonitorModelHelper.getNewDetailplanning({ aantalGepland: 210, jaartal: 2026, plancategorieId: "1_NieuwbouwEnum_NIEUWBOUW" }),
          PlanMonitorModelHelper.getNewDetailplanning({ aantalGepland: 120, jaartal: 2026, plancategorieId: "1_WoningtypeEnum_EENGEZINS" }),
          PlanMonitorModelHelper.getNewDetailplanning({ aantalGepland: 80, jaartal: 2027, plancategorieId: "1_WoningtypeEnum_MEERGEZINS" }),
          PlanMonitorModelHelper.getNewDetailplanning({ aantalGepland: 10, jaartal: 2028, plancategorieId: "1_WoningtypeEnum_ONBEKEND" }),
          PlanMonitorModelHelper.getNewDetailplanning({ aantalGepland: 210, jaartal: 2026, plancategorieId: "1_FlexwoningenEnum_FLEXWONINGEN" }),
          PlanMonitorModelHelper.getNewDetailplanning({ aantalGepland: 210, jaartal: 2026, plancategorieId: "1_WonenEnZorgEnum_ZORGGESCHIKT" }),
          PlanMonitorModelHelper.getNewDetailplanning({ aantalGepland: 210, jaartal: 2026, plancategorieId: "1_BetaalbaarheidEnum_ONBEKEND_KOOP_OF_HUUR" }),
        ],
      });
    }
    return of({ plancategorieen: [], detailplanningen: [] });
  }

  public savePlanregistratie$(_planRegistratieSaveModel: PlanregistratieSaveModel) {
    return of(true);
  }

  public deletePlanregistratie$(_id: string) {
    return of(true);
  }

  public autofillByGeometry$(_geometry: string): Observable<AutofillDataModel> {
    return of({
      gemeentes: [],
      regios: [],
      provincies: [],
      woonmilieus: [],
    });
  }

}
