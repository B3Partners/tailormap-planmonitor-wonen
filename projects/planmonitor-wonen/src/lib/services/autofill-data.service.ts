import { BehaviorSubject, catchError, Observable, of, take } from 'rxjs';
import { GemeenteModel } from '../models/gemeente.model';
import { Inject, Injectable } from '@angular/core';
import { PLANMONITOR_WONEN_API_SERVICE } from '../api/planmonitor-wonen-api.service.injection-token';
import { PlanmonitorWonenApiServiceModel } from '../api/planmonitor-wonen-api.service.model';
import { AutofillDataModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AutofillDataService {

  private gemeentesSubject = new BehaviorSubject<GemeenteModel[]>([]);

  constructor(
    @Inject(PLANMONITOR_WONEN_API_SERVICE) private api: PlanmonitorWonenApiServiceModel,
  ) {
  }

  public loadGemeentes(provincie?: string): void {
    this.api.getGemeentes$({ provincie })
      .pipe(take(1), catchError(() => of([])))
      .subscribe(gemeentes => {
        const newGemeenteNames = new Set(gemeentes.map(gemeente => gemeente.naam));
        const current = this.gemeentesSubject.value;
        const filteredGemeentes = current.filter(gemeente => !newGemeenteNames.has(gemeente.naam));
        this.gemeentesSubject.next([ ...gemeentes, ...filteredGemeentes ]);
      });
  }

  public getGemeentes$() {
    return this.gemeentesSubject.asObservable();
  }

  public loadAutofillData$(geometry: string): Observable<AutofillDataModel> {
    return this.api.autofillByGeometry$(geometry)
      .pipe(catchError(() => of({
        gemeentes: [],
        regios: [],
        provincies: [],
        woonmilieus: [],
      })));
  }

}
