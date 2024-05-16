/* eslint-disable max-len */
import { PlanmonitorWonenApiServiceModel } from './planmonitor-wonen-api.service.model';
import { Observable, of } from 'rxjs';
import {
  BetaalbaarheidEnum, DetailplanningModel, EigendomEnum, KnelpuntenMeerkeuzeEnum, KnelpuntenPlantypeEnum, OpdrachtgeverEnum,
  PlancategorieModel, PlanregistratieModel, PlantypeEnum, ProjectstatusEnum, StatusPlanologischEnum, VertrouwelijkheidEnum, WonenEnZorgEnum,
  WoningtypeEnum, WoonmilieuAbf13Enum, WoonmilieuAbf5Enum,
} from '../models';
import { Injectable } from '@angular/core';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { FlexwoningenEnum } from '../models/flexwoningen.enum';
import { PlanMonitorModelHelper } from '../helpers/planmonitor-model.helper';

@Injectable()
export class PlanmonitorWonenApiMockService implements PlanmonitorWonenApiServiceModel {

  public getPlanregistraties$(): Observable<PlanregistratieModel[]> {
    return of([{
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
      jaarStartProject: 2026,
      opleveringEerste: 2027,
      opleveringLaatste: 2030,
      opmerkingen: "",
      plantype: PlantypeEnum.HERSTRUCTURERING,
      bestemmingsplan: "Een Bestemmingsplan",
      statusProject: ProjectstatusEnum.VOORBEREIDING,
      statusPlanologisch: StatusPlanologischEnum.IN_VOORBEREIDING,
      knelpuntenMeerkeuze: KnelpuntenMeerkeuzeEnum.BEREIKBAARHEID,
      regionalePlanlijst: EigendomEnum.KOOPWONING,
      toelichtingKnelpunten: KnelpuntenPlantypeEnum.HERSTRUCTURERING,
      flexwoningen: 50,
      levensloopbestendigJa: 10,
      levensloopbestendigNee: 40,
      beoogdWoonmilieuAbf5: WoonmilieuAbf5Enum.BUITENCENTRUM,
      beoogdWoonmilieuAbf13: WoonmilieuAbf13Enum.CENTRUM_DORPS,
      aantalStudentenwoningen: 70,
      toelichtingKwalitatief: "",
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
      jaarStartProject: 2022,
      opleveringEerste: 2024,
      opleveringLaatste: 2028,
      opmerkingen: "",
      plantype: PlantypeEnum.TRANSFORMATIEGEBIED,
      bestemmingsplan: "Een Bestemmingsplan",
      statusProject: ProjectstatusEnum.START,
      statusPlanologisch: StatusPlanologischEnum.VASTGESTELD,
      knelpuntenMeerkeuze: KnelpuntenMeerkeuzeEnum.ANDERS,
      regionalePlanlijst: EigendomEnum.HUURWONING_WONINGCORPORATIE,
      toelichtingKnelpunten: KnelpuntenPlantypeEnum.TRANSFORMATIE_GEBOUW,
      flexwoningen: 80,
      levensloopbestendigJa: 20,
      levensloopbestendigNee: 90,
      beoogdWoonmilieuAbf5: WoonmilieuAbf5Enum.BUITENCENTRUM,
      beoogdWoonmilieuAbf13: WoonmilieuAbf13Enum.CENTRUM_DORPS,
      aantalStudentenwoningen: 80,
      toelichtingKwalitatief: "",
    }]);
  }

  public getPlancategorieen$(id: string): Observable<PlancategorieModel[]> {
    if (id === "2") {
      return of([
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "2_1", Planregistratie_ID: "2",	Woningtype: WoningtypeEnum.EENGEZINS, Totaal_Gepland: 80, Totaal_Gerealiseerd: 20 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "2_2", Planregistratie_ID: "2",	Woningtype: WoningtypeEnum.MEERGEZINS, Totaal_Gepland: 50, Totaal_Gerealiseerd: 10 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "2_3", Planregistratie_ID: "2",	Woningtype: WoningtypeEnum.ONBEKEND, Totaal_Gepland: 25, Totaal_Gerealiseerd: 15 }),
      ]);
    }
    if (id === "1") {
      return of([
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "1_NieuwbouwEnum_NIEUWBOUW", Planregistratie_ID: "1",	Nieuwbouw: NieuwbouwEnum.NIEUWBOUW, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "1_WoningtypeEnum_EENGEZINS", Planregistratie_ID: "1",	Woningtype: WoningtypeEnum.EENGEZINS, Totaal_Gepland: 120, Totaal_Gerealiseerd: 0 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "1_WoningtypeEnum_MEERGEZINS", Planregistratie_ID: "1",	Woningtype: WoningtypeEnum.MEERGEZINS, Totaal_Gepland: 80, Totaal_Gerealiseerd: 0 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "1_WoningtypeEnum_ONBEKEND", Planregistratie_ID: "1",	Woningtype: WoningtypeEnum.ONBEKEND, Totaal_Gepland: 10, Totaal_Gerealiseerd: 0 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "1_FlexwoningenEnum_FLEXWONINGEN", Planregistratie_ID: "1",	Flexwoningen: FlexwoningenEnum.FLEXWONINGEN, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "1_WonenEnZorgEnum_ZORGGESCHIKT", Planregistratie_ID: "1",	WonenenZorg: WonenEnZorgEnum.ZORGGESCHIKT, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
        PlanMonitorModelHelper.getNewPlancategorie({ ID: "1_BetaalbaarheidEnum_ONBEKEND_KOOP_OF_HUUR", Planregistratie_ID: "1",	Betaalbaarheid: BetaalbaarheidEnum.ONBEKEND_KOOP_OF_HUUR, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
      ]);
    }
    return of([]);
  }

  public getPlanDetailplanningen$(id: string): Observable<DetailplanningModel[]> {
    if (id === "2") {
      return of([
        { ID: "2_1_1", Planregistratie_ID: "2",	Creator: "test", Created: "2024-02-15", Edited: null, Editor: null, Aantal_Gepland: 80, Jaartal: 2026, Plancategorie_ID: "2_1" },
        { ID: "2_2_2", Planregistratie_ID: "2",	Creator: "test", Created: "2024-02-15", Edited: null, Editor: null, Aantal_Gepland: 50, Jaartal: 2026, Plancategorie_ID: "2_2" },
        { ID: "2_3_3", Planregistratie_ID: "2",	Creator: "test", Created: "2024-02-15", Edited: null, Editor: null, Aantal_Gepland: 25, Jaartal: 2026, Plancategorie_ID: "2_3" },
      ]);
    }
    if (id === "1") {
      return of([
        { ID: "1_NieuwbouwEnum_NIEUWBOUW_detail", Planregistratie_ID: "1", Creator: "test", Created: "2024-04-17", Edited: null, Editor: null, Aantal_Gepland: 210, Jaartal: 2026, Plancategorie_ID: "1_NieuwbouwEnum_NIEUWBOUW" },
        { ID: "1_WoningtypeEnum_EENGEZINS_detail", Planregistratie_ID: "1",	Creator: "test", Created: "2024-04-17", Edited: null, Editor: null, Aantal_Gepland: 120, Jaartal: 2026, Plancategorie_ID: "1_WoningtypeEnum_EENGEZINS" },
        { ID: "1_WoningtypeEnum_MEERGEZINS_detail", Planregistratie_ID: "1",	Creator: "test", Created: "2024-04-17", Edited: null, Editor: null, Aantal_Gepland: 80, Jaartal: 2027, Plancategorie_ID: "1_WoningtypeEnum_MEERGEZINS" },
        { ID: "1_WoningtypeEnum_ONBEKEND_detail", Planregistratie_ID: "1",	Creator: "test", Created: "2024-04-17", Edited: null, Editor: null, Aantal_Gepland: 10, Jaartal: 2028, Plancategorie_ID: "1_WoningtypeEnum_ONBEKEND" },
        { ID: "1_FlexwoningenEnum_FLEXWONINGEN_detail", Planregistratie_ID: "1", Creator: "test", Created: "2024-04-17", Edited: null, Editor: null, Aantal_Gepland: 210, Jaartal: 2026, Plancategorie_ID: "1_FlexwoningenEnum_FLEXWONINGEN" },
        { ID: "1_WonenEnZorgEnum_ZORGGESCHIKT_detail", Planregistratie_ID: "1", Creator: "test", Created: "2024-04-17", Edited: null, Editor: null, Aantal_Gepland: 210, Jaartal: 2026, Plancategorie_ID: "1_WonenEnZorgEnum_ZORGGESCHIKT" },
        { ID: "1_BetaalbaarheidEnum_ONBEKEND_KOOP_OF_HUUR_detail", Planregistratie_ID: "1", Creator: "test", Created: "2024-04-17", Edited: null, Editor: null, Aantal_Gepland: 210, Jaartal: 2026, Plancategorie_ID: "1_BetaalbaarheidEnum_ONBEKEND_KOOP_OF_HUUR" },
      ]);
    }
    return of([]);
  }

}
