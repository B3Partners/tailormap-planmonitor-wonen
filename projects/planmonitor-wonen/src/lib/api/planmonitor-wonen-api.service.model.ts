import { Observable } from 'rxjs';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel, PlanregistratieSaveModel } from '../models';

export interface PlanregistratieDetails {
  plancategorieen: PlancategorieModel[];
  detailplanningen: DetailplanningModel[];
}

export interface PlanmonitorWonenApiServiceModel {
  getPlanregistraties$(): Observable<PlanregistratieModel[]>;
  getPlandetails$(id: string): Observable<PlanregistratieDetails>;
  savePlanregistratie$(planRegistratieSaveModel: PlanregistratieSaveModel): Observable<boolean>;
  deletePlanregistratie$(id: string): Observable<boolean>;
}
