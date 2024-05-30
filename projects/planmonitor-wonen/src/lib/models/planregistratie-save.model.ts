import { PlanregistratieModel } from './planregistratie.model';
import { PlancategorieModel } from './plancategorie.model';
import { DetailplanningModel } from './detailplanning.model';

export interface PlanregistratieSaveModel {
  planregistratie: PlanregistratieModel;
  plancategorieen: PlancategorieModel[];
  detailplanningen: DetailplanningModel[];
}
