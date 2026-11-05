import { Observable } from 'rxjs';
import {
  AutofillDataModel, DetailplanningModel, GemeenteModel, PlancategorieModel, PlanregistratieModel, PlanregistratieSaveModel,
  PlanregistratieSaveResultModel,
} from '../models';
import { PlanregistratieWithDetailsModel } from '../models/planregistratie-with-details.model';

export interface PlanregistratieDetails {
  plancategorieen: PlancategorieModel[];
  detailplanningen: DetailplanningModel[];
}

export interface PlanmonitorWonenApiServiceModel {
  getGemeentes$(args?: { provincie?: string }): Observable<GemeenteModel[]>;
  autofillByGeometry$(geometry: string): Observable<AutofillDataModel>;
  getPlanregistraties$(): Observable<PlanregistratieModel[]>;
  getPlandetails$(id: string): Observable<PlanregistratieDetails>;
  savePlanregistratie$(planRegistratieSaveModel: PlanregistratieSaveModel): Observable<PlanregistratieSaveResultModel>;
  deletePlanregistratie$(id: string): Observable<boolean>;
  getPlanregistratiesWithDetails$(): Observable<PlanregistratieWithDetailsModel[]>;
}
