import { Inject, Injectable } from '@angular/core';
import { PLANMONITOR_WONEN_API_SERVICE } from '../api/planmonitor-wonen-api.service.injection-token';
import { PlanmonitorWonenApiServiceModel } from '../api/planmonitor-wonen-api.service.model';
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, Observable, of, take, tap } from 'rxjs';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel } from '../models';
import { LoadingStateEnum } from '@tailormap-viewer/shared';
import { PlancategorieTableHelper } from '../helpers/plancategorie-table.helper';
import { PlanValidationHelper } from '../helpers/plan-validation.helper';
import { PlanregistratieExportHelper } from '../helpers/planregistratie-export.helper';
import { PlanMonitorModelHelper } from '../helpers/planmonitor-model.helper';
import { CategorieTableModel } from '../models/categorie-table.model';
import { AutofillDataService } from './autofill-data.service';

@Injectable({
  providedIn: 'root',
})
export class PlanregistratiesService {

  private showLogging = true;

  private planRegistraties = new BehaviorSubject<PlanregistratieModel[]>([]);

  private selectedPlanregistratie = new BehaviorSubject<PlanregistratieModel | null>(null);
  private selectedPlanCategorieen = new BehaviorSubject<PlancategorieModel[] | null>(null);
  private selectedDetailplanningen = new BehaviorSubject<DetailplanningModel[] | null>(null);
  private selectedCategorieTable = new BehaviorSubject<CategorieTableModel | null>(null);

  private registratiesLoadStatus: LoadingStateEnum = LoadingStateEnum.INITIAL;
  private categorieenLoadStatus: LoadingStateEnum = LoadingStateEnum.INITIAL;

  public validChangedPlan$: Observable<boolean>;
  private hasTableChanges = new BehaviorSubject<boolean>(false);
  private hasFormChanges = new BehaviorSubject<boolean>(false);
  private creatingNewPlan = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(PLANMONITOR_WONEN_API_SERVICE) private api: PlanmonitorWonenApiServiceModel,
    private autofillDataService: AutofillDataService,
  ) {
    combineLatest([
      this.getSelectedPlanCategorieen$(),
      this.getSelectedDetailplanningen$(),
    ])
      .pipe(debounceTime(10))
      .subscribe(([ planCategorieen, detailPlanningen ]) => {
        if (planCategorieen === null || detailPlanningen === null) {
          this.selectedCategorieTable.next(null);
          return;
        }
        const table = PlancategorieTableHelper.getPlancategorieTable(planCategorieen, detailPlanningen);
        this.log('Recreated table', table, 'source data', planCategorieen, detailPlanningen);
        this.selectedCategorieTable.next(table);
      });
    this.validChangedPlan$ = combineLatest([
      this.selectedPlanregistratie.asObservable(),
      this.selectedCategorieTable.asObservable(),
      this.hasTableChanges.asObservable(),
      this.hasFormChanges.asObservable(),
    ]).pipe(
      map(([ updatedPlan, categorieTable, hasTableChanges, hasFormChanges ]) => {
        if (updatedPlan === null || categorieTable === null || (!hasTableChanges && !hasFormChanges)) {
          return false;
        }
        return PlanValidationHelper.validatePlan(updatedPlan, categorieTable);
      }),
    );
  }

  public getPlanregistraties$() {
    if (this.registratiesLoadStatus === LoadingStateEnum.INITIAL || this.registratiesLoadStatus === LoadingStateEnum.FAILED) {
      this.loadRegistraties();
    }
    return this.planRegistraties.asObservable();
  }

  public getSelectedPlanregistratie$(): Observable<PlanregistratieModel | null> {
    return this.selectedPlanregistratie.asObservable();
  }

  public getSelectedPlanCategorieen$(): Observable<PlancategorieModel[] | null> {
    return this.selectedPlanCategorieen.asObservable();
  }

  public getSelectedDetailplanningen$(): Observable<DetailplanningModel[] | null> {
    return this.selectedDetailplanningen.asObservable();
  }

  public getSelectedCategorieTable$(): Observable<CategorieTableModel | null> {
    return this.selectedCategorieTable.asObservable();
  }

  public hasValidChangedPlan$() {
    return this.validChangedPlan$;
  }

  public hasChanges$() {
    return combineLatest([
      this.hasTableChanges.asObservable(),
      this.hasFormChanges.asObservable(),
    ]).pipe(map(([ tableChanges, formChanges ]) => tableChanges || formChanges));
  }

  public isCreatingNewPlan$(): Observable<boolean> {
    return this.creatingNewPlan.asObservable();
  }

  public setSelectedPlanregistratie(id: string | null) {
    if (id !== null && id === this.selectedPlanregistratie.value?.id) {
      return;
    }
    const registratie = id === null ? null : this.planRegistraties.value.find(p => p.id === id);
    this.selectedPlanregistratie.next(registratie || null);
    this.selectedPlanCategorieen.next(null);
    this.selectedDetailplanningen.next(null);
    if (registratie) {
      this.loadPlancategorieen(registratie.id);
    }
    this.resetChanges();
  }

  private resetChanges() {
    this.hasFormChanges.next(false);
    this.hasTableChanges.next(false);
    this.creatingNewPlan.next(false);
  }

  public setCreateNewPlan(createNewPlan: boolean) {
    if (createNewPlan) {
      this.setSelectedPlanregistratie(null);
    }
    this.creatingNewPlan.next(createNewPlan);
  }

  private loadRegistraties() {
    this.registratiesLoadStatus = LoadingStateEnum.LOADING;
    this.api.getPlanregistraties$()
      .pipe(
        take(1),
        catchError(() => of(null)),
      )
      .subscribe(registraties => {
        this.registratiesLoadStatus = registraties === null ? LoadingStateEnum.FAILED : LoadingStateEnum.LOADED;
        this.planRegistraties.next(registraties || []);
      });
  }

  private loadPlancategorieen(registratieId: string) {
    this.categorieenLoadStatus = LoadingStateEnum.LOADING;
    this.api.getPlandetails$(registratieId)
      .pipe(
        catchError(() => of(null)),
        take(1),
      )
      .subscribe((details) => {
        this.categorieenLoadStatus = details ? LoadingStateEnum.FAILED : LoadingStateEnum.LOADED;
        this.selectedPlanCategorieen.next(details?.plancategorieen || []);
        this.selectedDetailplanningen.next(details?.detailplanningen || []);
      });
  }

  public export() {
    const currentReg = this.selectedPlanregistratie.value;
    const table = this.selectedCategorieTable.value;
    if (!currentReg || !table) {
      return;
    }
    PlanregistratieExportHelper.createExcelExport(currentReg.planNaam, table.rows);
  }

  public updatePlan(plan: Partial<PlanregistratieModel> | null) {
    this.log('Update Planregistratie', plan);
    if (plan === null || this.selectedPlanregistratie.value === null) {
      this.hasFormChanges.next(false);
      return;
    }
    this.hasFormChanges.next(true);
    this.selectedPlanregistratie.next({
      ...this.selectedPlanregistratie.value,
      ...plan,
    });
  }

  public setNewFeatureGeometry(geometry: string) {
    this.autofillDataService.loadAutofillData$(geometry)
      .pipe(take(1))
      .subscribe(autofillData => {
        const newPlan = PlanMonitorModelHelper.getNewPlanregistratie({
          gemeente: autofillData.gemeentes[0] || '',
          regio: autofillData.regios[0] || '',
          provincie: autofillData.provincies[0] || '',
          beoogdWoonmilieuAbf13: autofillData.woonmilieus[0] || null,
          geometrie: geometry,
        });
        this.planRegistraties.next([
          ...this.planRegistraties.value,
          newPlan,
        ]);
        this.setSelectedPlanregistratie(newPlan.id);
      });
  }

  public save$() {
    const updatedPlan = this.selectedPlanregistratie.value;
    const updatedCategorieen = this.selectedPlanCategorieen.value;
    const updatedDetailplanningen = this.selectedDetailplanningen.value;
    if (updatedPlan === null || updatedCategorieen === null || updatedDetailplanningen === null) {
      return of(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isNew, ...planregistratie } = updatedPlan;
    return this.api.savePlanregistratie$({
      planregistratie,
      plancategorieen: updatedCategorieen,
      detailplanningen: updatedDetailplanningen,
    })
      .pipe(
        tap(success => {
          if (success) {
            this.updatePlanAfterSaving(planregistratie);
          }
        }),
      );
  }

  public delete$(planregistratieId: string): Observable<boolean> {
    return this.api.deletePlanregistratie$(planregistratieId)
      .pipe(
        tap(success => {
          if (success) {
            this.removePlanAfterRemoving(planregistratieId);
          }
        }),
      );
  }

  private updatePlanAfterSaving(plan: PlanregistratieModel) {
    const currentPlans = [...this.planRegistraties.value];
    const idx = currentPlans.findIndex(p => p.id === plan.id);
    if (idx === -1) {
      currentPlans.push(plan);
    } else {
      currentPlans[idx] = plan;
    }
    this.planRegistraties.next(currentPlans);
    this.resetChanges();
  }

  private removePlanAfterRemoving(planregistratieId: string) {
    const currentPlans = this.planRegistraties.value;
    const idx = currentPlans.findIndex(p => p.id === planregistratieId);
    if (idx !== -1) {
      this.planRegistraties.next([ ...currentPlans.slice(0, idx), ...currentPlans.slice(idx + 1) ]);
    }
    if (this.selectedPlanregistratie.value?.id === planregistratieId) {
      this.selectedPlanregistratie.next(null);
      this.selectedPlanCategorieen.next(null);
      this.selectedDetailplanningen.next(null);
    }
  }

  public cancelChanges() {
    const hasNew = this.planRegistraties.value.find(r => r.isNew);
    if (hasNew) {
      this.planRegistraties.next(this.planRegistraties.value.filter(r => !r.isNew));
    }
    this.setSelectedPlanregistratie(null);
  }

  public updateCategorieField(
    categorieGroep: keyof PlancategorieModel,
    categorieGroepValue: string,
    field: keyof PlancategorieModel,
    value: number,
  ): PlancategorieModel | null {
    this.log('Update PlancategorieModel', categorieGroep, categorieGroepValue, field, value);
    const planregistratie = this.selectedPlanregistratie.value;
    if (!planregistratie) {
      return null;
    }
    const categorieen = this.selectedPlanCategorieen.value || [];
    const idx = this.findPlancategorieIndex(categorieGroep, categorieGroepValue);
    if (idx === -1) {
      const newCategorie = PlanMonitorModelHelper.getNewPlancategorie({
        planregistratieId: planregistratie.id,
        [categorieGroep]: categorieGroepValue,
        [field]: value,
      });
      this.selectedPlanCategorieen.next([
        ...categorieen,
        newCategorie,
      ]);
      this.hasTableChanges.next(true);
      this.log('Update PlancategorieModel - categorie does not exist, adding new categorie', newCategorie);
      return newCategorie;
    }
    const updatedCategorie: PlancategorieModel = {
      ...categorieen[idx],
      [field]: value,
    };
    this.selectedPlanCategorieen.next([
      ...categorieen.slice(0, idx),
      updatedCategorie,
      ...categorieen.slice(idx + 1),
    ]);
    this.log('Update PlancategorieModel - updating existing categorie', updatedCategorie);
    this.hasTableChanges.next(true);
    return updatedCategorie;
  }

  public updateDetailplanning(categorieGroep: keyof PlancategorieModel, categorieGroepValue: string, year: number, value: number): DetailplanningModel | null {
    this.log('Update DetailplanningModel', categorieGroep, categorieGroepValue, year, value);
    const planregistratie = this.selectedPlanregistratie.value;
    if (!planregistratie) {
      return null;
    }
    const categorie = this.findPlancategorie(categorieGroep, categorieGroepValue)
      || this.updateCategorieField(categorieGroep, categorieGroepValue, 'totaalGepland', 0);
    this.log('Update DetailplanningModel - found categorie', categorie);
    if (categorie === null) {
      return null;
    }
    const details = this.selectedDetailplanningen.value || [];
    const idx = (details || []).findIndex(p => {
      return p.jaartal === year && p.plancategorieId === categorie.id;
    });
    if (idx === -1) {
      const newDetailplanning = PlanMonitorModelHelper.getNewDetailplanning({
        plancategorieId: categorie.id,
        jaartal: year,
        aantalGepland: value,
      });
      this.selectedDetailplanningen.next([
        ...details,
        newDetailplanning,
      ]);
      this.hasTableChanges.next(true);
      this.log('Update DetailplanningModel - planning does not exist, adding new planning', newDetailplanning);
      return newDetailplanning;
    }
    const updatedDetailplanning: DetailplanningModel = {
      ...details[idx],
      aantalGepland: value,
    };
    this.selectedDetailplanningen.next([
      ...details.slice(0, idx),
      updatedDetailplanning,
      ...details.slice(idx + 1),
    ]);
    this.hasTableChanges.next(true);
    this.log('Update DetailplanningModel - updating existing planning', updatedDetailplanning);
    return updatedDetailplanning;
  }

  public setSelectedPlanregistratieGeometry(updatedGeometry: string) {
    this.updatePlan({ geometrie: updatedGeometry });
  }

  private findPlancategorieIndex(categorieGroep: keyof PlancategorieModel, categorieGroepValue: string): number {
    const categorieen = this.selectedPlanCategorieen.value || [];
    return (categorieen || []).findIndex(p => p[categorieGroep] === categorieGroepValue);
  }

  private findPlancategorie(categorieGroep: keyof PlancategorieModel, categorieGroepValue: string): PlancategorieModel | null {
    const idx = this.findPlancategorieIndex(categorieGroep, categorieGroepValue);
    if (idx === -1) {
      return null;
    }
    return (this.selectedPlanCategorieen.value || [])[idx] || null;
  }

  private log(...logs: any) {
    if (!this.showLogging) {
      return;
    }
    console.log(...logs);
  }

}
