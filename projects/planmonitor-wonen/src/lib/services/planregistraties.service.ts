import { Inject, Injectable } from '@angular/core';
import { PLANMONITOR_WONEN_API_SERVICE } from './planmonitor-wonen-api.service.injection-token';
import { PlanmonitorWonenApiServiceModel } from './planmonitor-wonen-api.service.model';
import { BehaviorSubject, catchError, Observable, of, take, tap } from 'rxjs';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel } from '../models';
import { LoadingStateEnum } from '@tailormap-viewer/shared';
import { PlancategorieHelper } from '../helpers/plancategorie.helper';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root',
})
export class PlanregistratiesService {

  private planRegistraties = new BehaviorSubject<PlanregistratieModel[]>([]);

  private selectedPlanregistratie = new BehaviorSubject<PlanregistratieModel | null>(null);
  private selectedPlanCategorieen = new BehaviorSubject<PlancategorieModel[] | null>(null);
  private selectedDetailplanningen = new BehaviorSubject<DetailplanningModel[] | null>(null);

  private registratiesLoadStatus: LoadingStateEnum = LoadingStateEnum.INITIAL;
  private categorieenLoadStatus: LoadingStateEnum = LoadingStateEnum.INITIAL;
  private detailPlanningenLoadStatus: LoadingStateEnum = LoadingStateEnum.INITIAL;

  constructor(
    @Inject(PLANMONITOR_WONEN_API_SERVICE) private api: PlanmonitorWonenApiServiceModel,
  ) {
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

  public setSelectedPlanregistratie(id: string | null) {
    const registratie = id === null ? null : this.planRegistraties.value.find(p => p.ID === id);
    if (registratie) {
      this.loadPlancategorieen(registratie.ID);
      this.loadDetailplanningen(registratie.ID);
    }
    this.selectedPlanregistratie.next(registratie || null);
  }

  public updatePlan$(plan: PlanregistratieModel) {
    // Save to backend
    return of(plan)
      .pipe(
        tap(updatedPlan => {
          const currentPlans = [...this.planRegistraties.value];
          const idx = currentPlans.findIndex(p => p.ID === updatedPlan.ID);
          if (idx === -1) {
            currentPlans.push(updatedPlan);
          } else {
            currentPlans[idx] = updatedPlan;
          }
          this.planRegistraties.next(currentPlans);
          if (this.selectedPlanregistratie.value?.ID === updatedPlan.ID) {
            this.selectedPlanregistratie.next(updatedPlan);
          }
        }),
      );
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
        // if (registraties) {
        //   this.setSelectedPlanregistratie(registraties[0].ID);
        // }
      });
  }

  private loadPlancategorieen(registratieId: string) {
    this.categorieenLoadStatus = LoadingStateEnum.LOADING;
    this.api.getPlancategorieen$(registratieId)
      .pipe(
        take(1),
        catchError(() => of(null)),
      )
      .subscribe(categorieen => {
        // console.log(categorieen);
        this.categorieenLoadStatus = categorieen === null ? LoadingStateEnum.FAILED : LoadingStateEnum.LOADED;
        this.selectedPlanCategorieen.next(categorieen);
      });
  }

  private loadDetailplanningen(registratieId: string) {
    this.detailPlanningenLoadStatus = LoadingStateEnum.LOADING;
    this.api.getPlanDetailplanningen$(registratieId)
      .pipe(
        take(1),
        catchError(() => of(null)),
      )
      .subscribe(detailPlanningen => {
        // console.log(detailPlanningen);
        this.detailPlanningenLoadStatus = detailPlanningen === null ? LoadingStateEnum.FAILED : LoadingStateEnum.LOADED;
        this.selectedDetailplanningen.next(detailPlanningen || []);
      });
  }

  public updateCategorieField(categorieGroep: keyof PlancategorieModel, categorieGroepValue: string, field: keyof PlancategorieModel, value: number) {
    const planregistratie = this.selectedPlanregistratie.value;
    if (!planregistratie) {
      return null;
    }
    const categorieen = this.selectedPlanCategorieen.value || [];
    const idx = (categorieen || []).findIndex(p => p[categorieGroep] === categorieGroepValue);
    if (idx === -1) {
      const newCategorie: PlancategorieModel = {
        ...PlancategorieHelper.getNewPlancategorie(),
        ID: nanoid(),
        IsNew: true,
        Planregistratie_ID: planregistratie.ID,
        [categorieGroep]: categorieGroepValue,
        [field]: value,
      };
      this.selectedPlanCategorieen.next([
        ...categorieen,
        newCategorie,
      ]);
      return newCategorie;
    } else {
      const updatedCategorie: PlancategorieModel = {
        ...categorieen[idx],
        [field]: value,
      };
      this.selectedPlanCategorieen.next([
        ...categorieen.slice(0, idx),
        updatedCategorie,
        ...categorieen.slice(idx + 1),
      ]);
      return updatedCategorie;
    }
  }

  public updateDetailplanning(categorieGroep: keyof PlancategorieModel, categorieGroepValue: string, year: number, value: number) {
    const planregistratie = this.selectedPlanregistratie.value;
    if (!planregistratie) {
      return;
    }
    const categorieen = this.selectedPlanCategorieen.value || [];
    const categorie = categorieen.find(p => p[categorieGroep] === categorieGroepValue)
      || this.updateCategorieField(categorieGroep, categorieGroepValue, 'Totaal_Gepland', 0);
    if (categorie === null) {
      return;
    }
    const details = this.selectedDetailplanningen.value || [];
    const idx = (details || []).findIndex(p => p.Jaartal === year);
    if (idx === -1) {
      this.selectedDetailplanningen.next([
        ...details,
        {
          ID: nanoid(),
          IsNew: true,
          Plancategorie_ID: categorie.ID,
          Jaartal: year,
          Aantal_Gepland: value,
          Created: new Date(),
          Creator: '',
          Editor: null,
          Edited: null,
        },
      ]);
    } else {
      this.selectedDetailplanningen.next([
        ...details.slice(0, idx),
        {
          ...details[idx],
          Aantal_Gepland: value,
        },
        ...details.slice(idx + 1),
      ]);
    }
  }

}
