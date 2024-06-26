import {
  ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import {
  KnelpuntenMeerkeuzeEnum, OpdrachtgeverEnum, PlanregistratieModel, PlantypeEnum, ProjectstatusEnum,
  StatusPlanologischEnum,
  VertrouwelijkheidEnum, WoonmilieuAbf13Enum,
} from '../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, Observable, of, combineLatest, map } from 'rxjs';
import { AutofillDataService } from '../services/autofill-data.service';
import { GemeenteModel } from '../models/gemeente.model';
import { PlanmonitorAuthenticationService } from '../services/planmonitor-authentication.service';

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
    vertrouwelijkheid: new FormControl<VertrouwelijkheidEnum | null>(null, { validators: [Validators.required] }),
    opdrachtgever_type: new FormControl<OpdrachtgeverEnum | null>(null, { validators: [Validators.required] }),
    opdrachtgever_naam: new FormControl<string>('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(3) ] }),
    opmerkingen: new FormControl<string>('', { nonNullable: true }),
    plantype: new FormControl<PlantypeEnum | null>(null, { validators: [Validators.required] }),
    status_project: new FormControl<ProjectstatusEnum | null>(null, { validators: [Validators.required] }),
    status_planologisch: new FormControl<StatusPlanologischEnum | null>(null, { validators: [Validators.required] }),
    knelpunten_meerkeuze: new FormControl<KnelpuntenMeerkeuzeEnum | null>(null, { validators: [Validators.required] }),
    beoogd_woonmilieu_abf13: new FormControl<WoonmilieuAbf13Enum | null>(null, { validators: [Validators.required] }),
    aantal_studentenwoningen: new FormControl<number | null>(null),
    sleutelproject: new FormControl<boolean | null>(null, { validators: [Validators.required] }),
  });

  public lists = {
    vertrouwelijkheid: Object.values(VertrouwelijkheidEnum),
    opdrachtgever: Object.values(OpdrachtgeverEnum),
    plantype: Object.values(PlantypeEnum),
    projectstatus: Object.values(ProjectstatusEnum),
    statusPlanologisch: Object.values(StatusPlanologischEnum),
    knelpuntenMeerkeuze: Object.values(KnelpuntenMeerkeuzeEnum),
    woonmilieuAbf13: Object.values(WoonmilieuAbf13Enum),
  };

  @Output()
  public planregistratieChanged = new EventEmitter<Partial<PlanregistratieModel> | null>();

  public gemeentes$: Observable<GemeenteModel[]> = of([]);
  public isProvincieGebruiker$: Observable<boolean> = of(false);
  public invalidGemeenteSelectedMessage$: Observable<string | null> = of(null);

  private selectedGemeenteSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private destroyRef: DestroyRef,
    private autofillDataService: AutofillDataService,
    private planmonitorAuthenticationService: PlanmonitorAuthenticationService,
  ) {
    this.gemeentes$ = this.autofillDataService.getGemeentes$();
    this.planmonitorAuthenticationService.ingelogdeGebruikerGemeente$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isGemeente => {
        if (isGemeente) {
          this.planregistratieForm.enable({ emitEvent: false });
        } else {
          this.planregistratieForm.disable({ emitEvent: false });
        }
      });
  }

  public ngOnInit(): void {
    this.planregistratieForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(250),
      )
      .subscribe(values => {
        this.selectedGemeenteSubject.next(values?.gemeente || null);
        this.planregistratieChanged.emit(this.parseForm(values));
      });
    this.isProvincieGebruiker$ = this.planmonitorAuthenticationService.isProvincieGebruiker$;
    this.invalidGemeenteSelectedMessage$ = combineLatest([
      this.planmonitorAuthenticationService.ingelogdeGebruikerGemeente$,
      this.selectedGemeenteSubject.asObservable(),
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(([ ingelogdeGebruikerGemeente, selectedGemeente ]) => {
          if (ingelogdeGebruikerGemeente === null || selectedGemeente === null) {
            return null;
          }
          if (ingelogdeGebruikerGemeente !== selectedGemeente) {
            // eslint-disable-next-line max-len
            return `U heeft de gemeente ${selectedGemeente} geselecteerd terwijl rechten heeft op de gemeente ${ingelogdeGebruikerGemeente}. U zult dit plan niet op kunnen slaan zonder in te loggen als een gebruiker met rechten voor de gemeente ${selectedGemeente}`;
          }
          return null;
        }),
      );
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
      opmerkingen: planregistratie ? planregistratie.opmerkingen : '',
      plantype: planregistratie ? planregistratie.plantype : null,
      status_project: planregistratie ? planregistratie.statusProject : null,
      status_planologisch: planregistratie ? planregistratie.statusPlanologisch : null,
      knelpunten_meerkeuze: planregistratie ? planregistratie.knelpuntenMeerkeuze : null,
      beoogd_woonmilieu_abf13: planregistratie ? planregistratie.beoogdWoonmilieuAbf13 : null,
      aantal_studentenwoningen: planregistratie ? planregistratie.aantalStudentenwoningen : null,
      sleutelproject: planregistratie ? planregistratie.sleutelproject: null,
    }, { emitEvent: false });
    this.selectedGemeenteSubject.next(planregistratie?.gemeente || null);
  }

  private parseForm(values: typeof this.planregistratieForm.value): Partial<PlanregistratieModel> | null {
    if (!this.planregistratie) {
      return null;
    }
    if (typeof values.vertrouwelijkheid === "undefined" || values.vertrouwelijkheid === null
      || typeof values.opdrachtgever_type === "undefined" || values.opdrachtgever_type === null
      || typeof values.plantype === "undefined" || values.plantype === null
      || typeof values.status_project === "undefined" || values.status_project === null
      || typeof values.status_planologisch === "undefined" || values.status_planologisch === null
      || typeof values.knelpunten_meerkeuze === "undefined" || values.knelpunten_meerkeuze === null
      || typeof values.beoogd_woonmilieu_abf13 === "undefined" || values.beoogd_woonmilieu_abf13 === null
      || typeof values.aantal_studentenwoningen === "undefined" || values.aantal_studentenwoningen === null
      || typeof values.sleutelproject === "undefined" || values.sleutelproject === null
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
      opmerkingen: values.opmerkingen ?? '',
      plantype: values.plantype,
      statusProject: values.status_project,
      statusPlanologisch: values.status_planologisch,
      knelpuntenMeerkeuze: values.knelpunten_meerkeuze,
      beoogdWoonmilieuAbf13: values.beoogd_woonmilieu_abf13,
      aantalStudentenwoningen: values.aantal_studentenwoningen,
      sleutelproject: values.sleutelproject,
    };
  }

}
