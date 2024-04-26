import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EigendomEnum, KnelpuntenMeerkeuzeEnum, KnelpuntenPlantypeEnum, OpdrachtgeverEnum, PlanregistratieModel, PlantypeEnum, ProjectstatusEnum,
  StatusPlanologischEnum,
  VertrouwelijkheidEnum, WoonmilieuABF13Enum, WoonmilieuABF5Enum,
} from '../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'lib-planregistratie-form',
  templateUrl: './planregistratie-form.component.html',
  styleUrls: ['./planregistratie-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanregistratieFormComponent implements OnInit {

  private _planregistratie: PlanregistratieModel | null = null;

  @Input()
  public set planregistratie(planregistratie: PlanregistratieModel | null) {
    this._planregistratie = planregistratie;
    this.patchForm(planregistratie);
  }
  public get planregistratie() {
    return this._planregistratie;
  }

  public planregistratieForm = new FormGroup({
    plannaam: new FormControl<string>('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(3) ] }),
    provincie: new FormControl<string>('', { nonNullable: true }),
    gemeente: new FormControl<string>('', { nonNullable: true }),
    regio: new FormControl<string>('', { nonNullable: true }),
    plaatsnaam: new FormControl<string>('', { nonNullable: true }),
    vertrouwelijkheid: new FormControl<VertrouwelijkheidEnum | null>(null),
    opdrachtgever_type: new FormControl<OpdrachtgeverEnum | null>(null),
    opdrachtgever_naam: new FormControl<string>('', { nonNullable: true }),
    jaar_start_project: new FormControl<number | null>(null),
    oplevering_eerste: new FormControl<number | null>(null),
    oplevering_laatste: new FormControl<number | null>(null),
    opmerkingen: new FormControl<string>('', { nonNullable: true }),
    plantype: new FormControl<PlantypeEnum | null>(null),
    bestemmingsplan: new FormControl<string>('', { nonNullable: true }),
    status_project: new FormControl<ProjectstatusEnum | null>(null),
    status_planologisch: new FormControl<StatusPlanologischEnum | null>(null),
    knelpunten_meerkeuze: new FormControl<KnelpuntenMeerkeuzeEnum | null>(null),
    regionale_planlijst: new FormControl<EigendomEnum | null>(null),
    toelichting_knelpunten: new FormControl<KnelpuntenPlantypeEnum | null>(null),
    flexwoningen: new FormControl<number | null>(null),
    levensloopbestendig_ja: new FormControl<number | null>(null, { validators: [Validators.required] }),
    levensloopbestendig_nee: new FormControl<number | null>(null, { validators: [Validators.required] }),
    beoogd_woonmilieu_abf5: new FormControl<WoonmilieuABF5Enum | null>(null),
    beoogd_woonmilieu_abf13: new FormControl<WoonmilieuABF13Enum | null>(null),
    aantal_studentenwoningen: new FormControl<number | null>(null),
    toelichting_kwalitatief: new FormControl<string>('', { nonNullable: true }),
  });

  public lists = {
    vertrouwelijkheid: Object.values(VertrouwelijkheidEnum),
    opdrachtgever: Object.values(OpdrachtgeverEnum),
    plantype: Object.values(PlantypeEnum),
    projectstatus: Object.values(ProjectstatusEnum),
    statusPlanologisch: Object.values(StatusPlanologischEnum),
    knelpuntenMeerkeuze: Object.values(KnelpuntenMeerkeuzeEnum),
    eigendom: Object.values(EigendomEnum),
    knelpuntenPlantype: Object.values(KnelpuntenPlantypeEnum),
    woonmilieuAbf5: Object.values(WoonmilieuABF5Enum),
    woonmilieuAbf13: Object.values(WoonmilieuABF13Enum),
  };

  @Output()
  public planregistratieChanged = new EventEmitter<Partial<PlanregistratieModel> | null>();

  constructor(
    private destroyRef: DestroyRef,
  ) { }

  public ngOnInit(): void {
    this.planregistratieForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(250),
      )
      .subscribe(values => {
        this.planregistratieChanged.emit(this.parseForm(values));
      });
  }

  private patchForm(planregistratie: PlanregistratieModel | null) {
    this.planregistratieForm.patchValue({
      plannaam: planregistratie ? planregistratie.Plannaam : '',
      provincie: planregistratie ? planregistratie.Provincie : '',
      gemeente: planregistratie ? planregistratie.Gemeente : '',
      regio: planregistratie ? planregistratie.Regio : '',
      plaatsnaam: planregistratie ? planregistratie.Plaatsnaam : '',
      vertrouwelijkheid: planregistratie ? planregistratie.Vertrouwelijkheid : null,
      opdrachtgever_type: planregistratie ? planregistratie.Opdrachtgever_Type : null,
      opdrachtgever_naam: planregistratie ? planregistratie.Opdrachtgever_Naam : '',
      jaar_start_project: planregistratie ? planregistratie.Jaar_Start_Project : null,
      oplevering_eerste: planregistratie ? planregistratie.Oplevering_Eerste : null,
      oplevering_laatste: planregistratie ? planregistratie.Oplevering_Laatste : null,
      opmerkingen: planregistratie ? planregistratie.Opmerkingen : '',
      plantype: planregistratie ? planregistratie.Plantype : null,
      bestemmingsplan: planregistratie ? planregistratie.Bestemmingsplan : '',
      status_project: planregistratie ? planregistratie.Status_Project : null,
      status_planologisch: planregistratie ? planregistratie.Status_Planologisch : null,
      knelpunten_meerkeuze: planregistratie ? planregistratie.Knelpunten_Meerkeuze : null,
      regionale_planlijst: planregistratie ? planregistratie.Regionale_Planlijst : null,
      toelichting_knelpunten: planregistratie ? planregistratie.Toelichting_Knelpunten : null,
      flexwoningen: planregistratie ? planregistratie.Flexwoningen : null,
      levensloopbestendig_ja: planregistratie ? planregistratie.Levensloopbestendig_Ja : null,
      levensloopbestendig_nee: planregistratie ? planregistratie.Levensloopbestendig_Nee : null,
      beoogd_woonmilieu_abf5: planregistratie ? planregistratie.Beoogd_Woonmilieu_ABF5 : null,
      beoogd_woonmilieu_abf13: planregistratie ? planregistratie.Beoogd_Woonmilieu_ABF13 : null,
      aantal_studentenwoningen: planregistratie ? planregistratie.Aantal_Studentenwoningen : null,
      toelichting_kwalitatief: planregistratie ? planregistratie.Toelichting_Kwalitatief : '',
    }, { emitEvent: false });
  }

  private parseForm(values: typeof this.planregistratieForm.value): Partial<PlanregistratieModel> | null {
    if (!this.planregistratie) {
      return null;
    }
    if (typeof values.vertrouwelijkheid === "undefined" || values.vertrouwelijkheid === null
      || typeof values.opdrachtgever_type === "undefined" || values.opdrachtgever_type === null
      || typeof values.jaar_start_project === "undefined" || values.jaar_start_project === null
      || typeof values.oplevering_eerste === "undefined" || values.oplevering_eerste === null
      || typeof values.oplevering_laatste === "undefined" || values.oplevering_laatste === null
      || typeof values.plantype === "undefined" || values.plantype === null
      || typeof values.status_project === "undefined" || values.status_project === null
      || typeof values.status_planologisch === "undefined" || values.status_planologisch === null
      || typeof values.knelpunten_meerkeuze === "undefined" || values.knelpunten_meerkeuze === null
      || typeof values.regionale_planlijst === "undefined" || values.regionale_planlijst === null
      || typeof values.toelichting_knelpunten === "undefined" || values.toelichting_knelpunten === null
      || typeof values.flexwoningen === "undefined" || values.flexwoningen === null
      || typeof values.levensloopbestendig_ja === "undefined" || values.levensloopbestendig_ja === null
      || typeof values.levensloopbestendig_nee === "undefined" || values.levensloopbestendig_nee === null
      || typeof values.beoogd_woonmilieu_abf5 === "undefined" || values.beoogd_woonmilieu_abf5 === null
      || typeof values.beoogd_woonmilieu_abf13 === "undefined" || values.beoogd_woonmilieu_abf13 === null
      || typeof values.aantal_studentenwoningen === "undefined" || values.aantal_studentenwoningen === null
    ) {
      return null;
    }
    return {
      Plannaam: values.plannaam ?? '',
      Provincie: values.provincie ?? '',
      Gemeente: values.gemeente ?? '',
      Regio: values.regio ?? '',
      Plaatsnaam: values.plaatsnaam ?? '',
      Vertrouwelijkheid: values.vertrouwelijkheid,
      Opdrachtgever_Type: values.opdrachtgever_type,
      Opdrachtgever_Naam: values.opdrachtgever_naam ?? '',
      Jaar_Start_Project: values.jaar_start_project,
      Oplevering_Eerste: values.oplevering_eerste,
      Oplevering_Laatste: values.oplevering_laatste,
      Opmerkingen: values.opmerkingen ?? '',
      Plantype: values.plantype,
      Bestemmingsplan: values.bestemmingsplan ?? '',
      Status_Project: values.status_project,
      Status_Planologisch: values.status_planologisch,
      Knelpunten_Meerkeuze: values.knelpunten_meerkeuze,
      Regionale_Planlijst: values.regionale_planlijst,
      Toelichting_Knelpunten: values.toelichting_knelpunten,
      Flexwoningen: values.flexwoningen,
      Levensloopbestendig_Ja: values.levensloopbestendig_ja,
      Levensloopbestendig_Nee: values.levensloopbestendig_nee,
      Beoogd_Woonmilieu_ABF5: values.beoogd_woonmilieu_abf5,
      Beoogd_Woonmilieu_ABF13: values.beoogd_woonmilieu_abf13,
      Aantal_Studentenwoningen: values.aantal_studentenwoningen,
      Toelichting_Kwalitatief: values.toelichting_kwalitatief ?? '',
    };
  }

}
