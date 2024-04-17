import { Inject, Injectable } from '@angular/core';
import { PLANMONITOR_WONEN_API_SERVICE } from './planmonitor-wonen-api.service.injection-token';
import { PlanmonitorWonenApiServiceModel } from './planmonitor-wonen-api.service.model';
import { BehaviorSubject, catchError, Observable, of, take } from 'rxjs';
import { PlanregistratieModel } from '../models';
import { LoadingStateEnum } from '@tailormap-viewer/shared';

@Injectable({
  providedIn: 'root',
})
export class PlanregistratiesService {

  private planRegistraties = new BehaviorSubject<PlanregistratieModel[]>([]);
  private selectedPlanregistratie = new BehaviorSubject<PlanregistratieModel | null>(null);

  private registratiesLoadStatus: LoadingStateEnum = LoadingStateEnum.INITIAL;

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

  public setSelectedPlanregistratie(id: string | null) {
    const registratie = id === null ? null : this.planRegistraties.value.find(p => p.ID === id);
    this.selectedPlanregistratie.next(registratie || null);
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

}
