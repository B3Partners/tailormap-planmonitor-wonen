import { Observable } from 'rxjs';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel } from '../models';

export interface PlanmonitorWonenApiServiceModel {
  getPlanregistraties$(): Observable<PlanregistratieModel[]>;
  getPlancategorieen$(id: string): Observable<PlancategorieModel[]>;
  getPlanDetailplanningen$(id: string): Observable<DetailplanningModel[]>;
}
