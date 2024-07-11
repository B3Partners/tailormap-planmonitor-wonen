import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AutofillDataModel, GemeenteModel, PlanregistratieModel, PlanregistratieSaveModel } from '../models';
import { catchError, map, Observable, of } from 'rxjs';
import { PlanmonitorWonenApiServiceModel, PlanregistratieDetails } from './planmonitor-wonen-api.service.model';
import { PlanregistratieWithDetailsModel } from '../models/planregistratie-with-details.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClientModule],
})
export class PlanmonitorWonenApiService implements PlanmonitorWonenApiServiceModel {

  private apiBaseUrl = '/api/planmonitor-wonen';

  constructor(private http: HttpClient) {}

  public getGemeentes$(args?: { provincie?: string }): Observable<GemeenteModel[]> {
    let params = new HttpParams();
    if (args?.provincie) {
      params = params.append('provincie', args.provincie);
    }
    return this.http.get<GemeenteModel[]>(`${this.apiBaseUrl}/gemeentes`, { params });
  }

  public getPlanregistraties$(): Observable<PlanregistratieModel[]> {
    return this.http.get<PlanregistratieModel[]>(`${this.apiBaseUrl}/planregistraties`);
  }

  public getPlandetails$(id: string): Observable<PlanregistratieDetails> {
    return this.http.get<PlanregistratieDetails>(`${this.apiBaseUrl}/planregistratie/${id}/details`);
  }

  public savePlanregistratie$(planRegistratieSaveModel: PlanregistratieSaveModel): Observable<boolean> {
    return this.http.put(`${this.apiBaseUrl}/planregistratie/${planRegistratieSaveModel.planregistratie.id}`, planRegistratieSaveModel, {
      observe: 'response',
    }).pipe(
      map(response => response.ok),
      catchError((_error: HttpErrorResponse) => {
        return of(false);
      }),
    );
  }

  public deletePlanregistratie$(planRegistratieId: string): Observable<boolean> {
    return this.http.delete(`${this.apiBaseUrl}/planregistratie/${planRegistratieId}`, {
      observe: 'response',
    }).pipe(
      map(response => response.ok),
      catchError((_error: HttpErrorResponse) => {
        return of(false);
      }),
    );
  }

  public autofillByGeometry$(geometry: string): Observable<AutofillDataModel> {
    return this.http.post<AutofillDataModel>(`${this.apiBaseUrl}/planregistratie/autofill-by-geometry`, geometry);
  }

  public getPlanregistratiesWithDetails$(): Observable<PlanregistratieWithDetailsModel[]> {
    return this.http.get<PlanregistratieWithDetailsModel[]>(`${this.apiBaseUrl}/planregistraties`, {
      params: { details: true },
    });
  }

}
