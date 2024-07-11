import { PlanregistratieModel } from './planregistratie.model';
import { PlancategorieModel } from './plancategorie.model';
import { DetailplanningModel } from './detailplanning.model';

export interface PlanregistratieWithDetailsModel extends PlanregistratieModel {
  plancategorieList: PlancategorieModel[];
  detailplanningList: DetailplanningModel[];
}
