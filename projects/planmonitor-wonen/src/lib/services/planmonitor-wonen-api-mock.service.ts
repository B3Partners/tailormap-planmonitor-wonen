/* eslint-disable max-len */
import { PlanmonitorWonenApiServiceModel } from './planmonitor-wonen-api.service.model';
import { Observable, of } from 'rxjs';
import {
  BetaalbaarheidEnum, DetailplanningModel, EigendomEnum, KnelpuntenMeerkeuzeEnum, KnelpuntenPlantypeEnum, OpdrachtgeverEnum,
  PlancategorieModel, PlanregistratieModel, PlantypeEnum, ProjectstatusEnum, StatusPlanologischEnum, VertrouwelijkheidEnum, WonenEnZorgEnum,
  WoningtypeEnum, WoonmilieuABF13Enum, WoonmilieuABF5Enum,
} from '../models';
import { Injectable } from '@angular/core';
import { PlancategorieHelper } from '../helpers/plancategorie.helper';
import { NieuwbouwEnum } from '../models/nieuwbouw.enum';
import { FlexwoningenEnum } from '../models/flexwoningen.enum';

@Injectable()
export class PlanmonitorWonenApiMockService implements PlanmonitorWonenApiServiceModel {

  public getPlanregistraties$(): Observable<PlanregistratieModel[]> {
    return of([{
      ID: "1",
      GEOM: "POLYGON ((27791.55972066056 397785.16112066095, 24697.205902478643 393790.63164628064, 26778.86210743738 391483.93152727233, 30548.347667768074 395084.6341520658, 30548.347667768074 395084.6341520658, 27791.55972066056 397785.16112066095))",
      Creator: "test",
      Created: "2024-04-17",
      Editor: "test",
      Edited: "2024-04-17",
      Plannaam: "Plan 1",
      Provincie: "Zeeland",
      Gemeente: "Middelburg",
      Regio: "Walcheren",
      Plaatsnaam: "Middelburg",
      Vertrouwelijkheid: VertrouwelijkheidEnum.GEMEENTE,
      Opdrachtgever_Type: OpdrachtgeverEnum.GEMEENTE,
      Opdrachtgever_Naam: "Middelburg",
      Jaar_Start_Project: 2026,
      Oplevering_Eerste: 2027,
      Oplevering_Laatste: 2030,
      Opmerkingen: "",
      Plantype: PlantypeEnum.HERSTRUCTURERING,
      Bestemmingsplan: "Een Bestemmingsplan",
      Status_Project: ProjectstatusEnum.VOORBEREIDING,
      Status_Planologisch: StatusPlanologischEnum.IN_VOORBEREIDING,
      Knelpunten_Meerkeuze: KnelpuntenMeerkeuzeEnum.BEREIKBAARHEID,
      Regionale_Planlijst: EigendomEnum.KOOPWONING,
      Toelichting_Knelpunten: KnelpuntenPlantypeEnum.HERSTRUCTURERING,
      Flexwoningen: 50,
      Levensloopbestendig_Ja: 10,
      Levensloopbestendig_Nee: 40,
      Beoogd_Woonmilieu_ABF5: WoonmilieuABF5Enum.BUITENCENTRUM,
      Beoogd_Woonmilieu_ABF13: WoonmilieuABF13Enum.CENTRUM_DORPS,
      Aantal_Studentenwoningen: 70,
      Toelichting_Kwalitatief: "",
    }, {
      ID: "2",
      GEOM: "POLYGON ((25814.84 390517.68, 28825.4 390410.16, 28449.08 388447.92, 26056.76 388743.6, 25814.84 390517.68))",
      Creator: "test",
      Created: "2024-04-17",
      Editor: "test",
      Edited: "2024-04-17",
      Plannaam: "Plan 2",
      Provincie: "Zeeland",
      Gemeente: "Vlissingen",
      Regio: "Walcheren",
      Plaatsnaam: "Vlissingen",
      Vertrouwelijkheid: VertrouwelijkheidEnum.GEMEENTE,
      Opdrachtgever_Type: OpdrachtgeverEnum.GEMEENTE,
      Opdrachtgever_Naam: "Vlissingen",
      Jaar_Start_Project: 2022,
      Oplevering_Eerste: 2024,
      Oplevering_Laatste: 2028,
      Opmerkingen: "",
      Plantype: PlantypeEnum.TRANSFORMATIEGEBIED,
      Bestemmingsplan: "Een Bestemmingsplan",
      Status_Project: ProjectstatusEnum.START,
      Status_Planologisch: StatusPlanologischEnum.VASTGESTELD,
      Knelpunten_Meerkeuze: KnelpuntenMeerkeuzeEnum.ANDERS,
      Regionale_Planlijst: EigendomEnum.HUURWONING_WONINGCORPORATIE,
      Toelichting_Knelpunten: KnelpuntenPlantypeEnum.TRANSFORMATIE_GEBOUW,
      Flexwoningen: 80,
      Levensloopbestendig_Ja: 20,
      Levensloopbestendig_Nee: 90,
      Beoogd_Woonmilieu_ABF5: WoonmilieuABF5Enum.BUITENCENTRUM,
      Beoogd_Woonmilieu_ABF13: WoonmilieuABF13Enum.CENTRUM_DORPS,
      Aantal_Studentenwoningen: 80,
      Toelichting_Kwalitatief: "",
    }]);
  }

  public getPlancategorieen$(id: string): Observable<PlancategorieModel[]> {
    if (id === "2") {
      return of([
        PlancategorieHelper.getNewPlancategorie({ ID: "2_1", Planregistratie_ID: "2",	Woningtype: WoningtypeEnum.EENGEZINS, Totaal_Gepland: 80, Totaal_Gerealiseerd: 20 }),
        PlancategorieHelper.getNewPlancategorie({ ID: "2_2", Planregistratie_ID: "2",	Woningtype: WoningtypeEnum.MEERGEZINS, Totaal_Gepland: 50, Totaal_Gerealiseerd: 10 }),
        PlancategorieHelper.getNewPlancategorie({ ID: "2_3", Planregistratie_ID: "2",	Woningtype: WoningtypeEnum.ONBEKEND, Totaal_Gepland: 25, Totaal_Gerealiseerd: 15 }),
      ]);
    }
    return of([
      PlancategorieHelper.getNewPlancategorie({ ID: "1_NieuwbouwEnum_NIEUWBOUW", Planregistratie_ID: "1",	Nieuwbouw: NieuwbouwEnum.NIEUWBOUW, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
      PlancategorieHelper.getNewPlancategorie({ ID: "1_WoningtypeEnum_EENGEZINS", Planregistratie_ID: "1",	Woningtype: WoningtypeEnum.EENGEZINS, Totaal_Gepland: 120, Totaal_Gerealiseerd: 0 }),
      PlancategorieHelper.getNewPlancategorie({ ID: "1_WoningtypeEnum_MEERGEZINS", Planregistratie_ID: "1",	Woningtype: WoningtypeEnum.MEERGEZINS, Totaal_Gepland: 80, Totaal_Gerealiseerd: 0 }),
      PlancategorieHelper.getNewPlancategorie({ ID: "1_WoningtypeEnum_ONBEKEND", Planregistratie_ID: "1",	Woningtype: WoningtypeEnum.ONBEKEND, Totaal_Gepland: 10, Totaal_Gerealiseerd: 0 }),
      PlancategorieHelper.getNewPlancategorie({ ID: "1_FlexwoningenEnum_FLEXWONINGEN", Planregistratie_ID: "1",	Flexwoningen: FlexwoningenEnum.FLEXWONINGEN, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
      PlancategorieHelper.getNewPlancategorie({ ID: "1_WonenEnZorgEnum_ZORGGESCHIKT", Planregistratie_ID: "1",	WonenenZorg: WonenEnZorgEnum.ZORGGESCHIKT, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
      PlancategorieHelper.getNewPlancategorie({ ID: "1_BetaalbaarheidEnum_ONBEKEND_KOOP_OF_HUUR", Planregistratie_ID: "1",	Betaalbaarheid: BetaalbaarheidEnum.ONBEKEND_KOOP_OF_HUUR, Totaal_Gepland: 210, Totaal_Gerealiseerd: 0 }),
    ]);
  }

  public getPlanDetailplanningen$(id: string): Observable<DetailplanningModel[]> {
    if (id === "2") {
      return of([
        { ID: "2_1_1", Planregistratie_ID: "2",	Creator: "test", Created: "2024-02-15", Edited: null, Editor: null, Aantal_Gepland: 80, Jaartal: 2026, Plancategorie_ID: "2_1" },
        { ID: "2_2_2", Planregistratie_ID: "2",	Creator: "test", Created: "2024-02-15", Edited: null, Editor: null, Aantal_Gepland: 50, Jaartal: 2026, Plancategorie_ID: "2_2" },
        { ID: "2_3_3", Planregistratie_ID: "2",	Creator: "test", Created: "2024-02-15", Edited: null, Editor: null, Aantal_Gepland: 25, Jaartal: 2026, Plancategorie_ID: "2_3" },
      ]);
    }
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

}
