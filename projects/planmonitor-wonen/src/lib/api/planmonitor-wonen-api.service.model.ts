import { Observable } from 'rxjs';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel } from '../models';

export interface PlanregistratieDetails {
  plancategorieen: PlancategorieModel[],
  detailplanningen: DetailplanningModel[]
}

export interface PlanmonitorWonenApiServiceModel {
  getPlanregistraties$(): Observable<PlanregistratieModel[]>;
  getPlandetails$(id: string): Observable<PlanregistratieDetails>;
}
