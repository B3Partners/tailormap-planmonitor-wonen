import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel } from '../models';
import { Observable } from 'rxjs';
import { PlanmonitorWonenApiServiceModel } from './planmonitor-wonen-api.service.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClientModule],
})
export class PlanmonitorWonenApiService implements PlanmonitorWonenApiServiceModel {

  private apiBaseUrl = '/planmonitor-api/';

  constructor(private http: HttpClient) {}

  public getPlanregistraties$(): Observable<PlanregistratieModel[]> {
    return this.http.get<PlanregistratieModel[]>(`${this.apiBaseUrl}/planregistraties`);
  }

  public getPlancategorieen$(id: string): Observable<PlancategorieModel[]> {
    return this.http.get<PlancategorieModel[]>(`${this.apiBaseUrl}/plancategorieen/${id}`);
  }

  public getPlanDetailplanningen$(id: string): Observable<DetailplanningModel[]> {
    return this.http.get<DetailplanningModel[]>(`${this.apiBaseUrl}/plandetailplanningen/${id}`);
  }

}
