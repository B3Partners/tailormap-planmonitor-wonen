import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel } from '../models';
import { Observable } from 'rxjs';
import { PlanmonitorWonenApiServiceModel, PlanregistratieDetails } from './planmonitor-wonen-api.service.model';
import ol from 'ol/dist/ol';
import string = ol.string;

@Injectable({
  providedIn: 'root',
  deps: [HttpClientModule],
})
export class PlanmonitorWonenApiService implements PlanmonitorWonenApiServiceModel {

  private apiBaseUrl = '/api/planmonitor-wonen';

  constructor(private http: HttpClient) {}

  public getPlanregistraties$(): Observable<PlanregistratieModel[]> {
    return this.http.get<PlanregistratieModel[]>(`${this.apiBaseUrl}/planregistraties`);
  }

  public getPlandetails$(id: string): Observable<PlanregistratieDetails> {
    return this.http.get<PlanregistratieDetails>(`${this.apiBaseUrl}/planregistratie/${id}/details`);
  }
}
