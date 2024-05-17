import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EigendomEnum, KnelpuntenMeerkeuzeEnum, KnelpuntenPlantypeEnum, OpdrachtgeverEnum, PlanregistratieModel, PlantypeEnum, ProjectstatusEnum,
  StatusPlanologischEnum,
  VertrouwelijkheidEnum, WoonmilieuAbf13Enum, WoonmilieuAbf5Enum,
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
    beoogd_woonmilieu_abf5: new FormControl<WoonmilieuAbf5Enum | null>(null),
    beoogd_woonmilieu_abf13: new FormControl<WoonmilieuAbf13Enum | null>(null),
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
    woonmilieuAbf5: Object.values(WoonmilieuAbf5Enum),
    woonmilieuAbf13: Object.values(WoonmilieuAbf13Enum),
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
      plannaam: planregistratie ? planregistratie.planNaam : '',
      provincie: planregistratie ? planregistratie.provincie : '',
      gemeente: planregistratie ? planregistratie.gemeente : '',
      regio: planregistratie ? planregistratie.regio : '',
      plaatsnaam: planregistratie ? planregistratie.plaatsnaam : '',
      vertrouwelijkheid: planregistratie ? planregistratie.vertrouwelijkheid : null,
      opdrachtgever_type: planregistratie ? planregistratie.opdrachtgeverType : null,
      opdrachtgever_naam: planregistratie ? planregistratie.opdrachtgeverNaam : '',
      jaar_start_project: planregistratie ? planregistratie.jaarStartProject : null,
      oplevering_eerste: planregistratie ? planregistratie.opleveringEerste : null,
      oplevering_laatste: planregistratie ? planregistratie.opleveringLaatste : null,
      opmerkingen: planregistratie ? planregistratie.opmerkingen : '',
      plantype: planregistratie ? planregistratie.plantype : null,
      bestemmingsplan: planregistratie ? planregistratie.bestemmingsplan : '',
      status_project: planregistratie ? planregistratie.statusProject : null,
      status_planologisch: planregistratie ? planregistratie.statusPlanologisch : null,
      knelpunten_meerkeuze: planregistratie ? planregistratie.knelpuntenMeerkeuze : null,
      regionale_planlijst: planregistratie ? planregistratie.regionalePlanlijst : null,
      toelichting_knelpunten: planregistratie ? planregistratie.toelichtingKnelpunten : null,
      flexwoningen: planregistratie ? planregistratie.flexwoningen : null,
      levensloopbestendig_ja: planregistratie ? planregistratie.levensloopbestendigJa : null,
      levensloopbestendig_nee: planregistratie ? planregistratie.levensloopbestendigNee : null,
      beoogd_woonmilieu_abf5: planregistratie ? planregistratie.beoogdWoonmilieuAbf5 : null,
      beoogd_woonmilieu_abf13: planregistratie ? planregistratie.beoogdWoonmilieuAbf13 : null,
      aantal_studentenwoningen: planregistratie ? planregistratie.aantalStudentenwoningen : null,
      toelichting_kwalitatief: planregistratie ? planregistratie.toelichtingKwalitatief : '',
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
      planNaam: values.plannaam ?? '',
      provincie: values.provincie ?? '',
      gemeente: values.gemeente ?? '',
      regio: values.regio ?? '',
      plaatsnaam: values.plaatsnaam ?? '',
      vertrouwelijkheid: values.vertrouwelijkheid,
      opdrachtgeverType: values.opdrachtgever_type,
      opdrachtgeverNaam: values.opdrachtgever_naam ?? '',
      jaarStartProject: values.jaar_start_project,
      opleveringEerste: values.oplevering_eerste,
      opleveringLaatste: values.oplevering_laatste,
      opmerkingen: values.opmerkingen ?? '',
      plantype: values.plantype,
      bestemmingsplan: values.bestemmingsplan ?? '',
      statusProject: values.status_project,
      statusPlanologisch: values.status_planologisch,
      knelpuntenMeerkeuze: values.knelpunten_meerkeuze,
      regionalePlanlijst: values.regionale_planlijst,
      toelichtingKnelpunten: values.toelichting_knelpunten,
      flexwoningen: values.flexwoningen,
      levensloopbestendigJa: values.levensloopbestendig_ja,
      levensloopbestendigNee: values.levensloopbestendig_nee,
      beoogdWoonmilieuAbf5: values.beoogd_woonmilieu_abf5,
      beoogdWoonmilieuAbf13: values.beoogd_woonmilieu_abf13,
      aantalStudentenwoningen: values.aantal_studentenwoningen,
      toelichtingKwalitatief: values.toelichting_kwalitatief ?? '',
    };
  }

}
