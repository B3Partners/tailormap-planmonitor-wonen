import { Observable } from 'rxjs';
import {
  AutofillDataModel, DetailplanningModel, GemeenteModel, PlancategorieModel, PlanregistratieModel, PlanregistratieSaveModel,
} from '../models';

export interface PlanregistratieDetails {
  plancategorieen: PlancategorieModel[];
  detailplanningen: DetailplanningModel[];
}

export interface PlanmonitorWonenApiServiceModel {
  getGemeentes$(args?: { provincie?: string }): Observable<GemeenteModel[]>;
  autofillByGeometry$(geometry: string): Observable<AutofillDataModel>;
  getPlanregistraties$(): Observable<PlanregistratieModel[]>;
  getPlandetails$(id: string): Observable<PlanregistratieDetails>;
  savePlanregistratie$(planRegistratieSaveModel: PlanregistratieSaveModel): Observable<boolean>;
  deletePlanregistratie$(id: string): Observable<boolean>;
}
