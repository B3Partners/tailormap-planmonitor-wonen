import { PlanregistratieModel } from '../models';
import { CategorieTableModel } from '../models/categorie-table.model';

export class PlanValidationHelper {

  public static validatePlan(planRegistratie: PlanregistratieModel, categorieTable: CategorieTableModel | null) {
    if (
      PlanValidationHelper.hasEmptyValue(planRegistratie.planNaam)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.provincie)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.gemeente)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.regio)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.plaatsnaam)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.vertrouwelijkheid)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.opdrachtgeverType)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.plantype)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.statusProject)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.statusPlanologisch)
      || (planRegistratie.knelpuntenMeerkeuze || []).length === 0
      || PlanValidationHelper.hasEmptyValue(planRegistratie.beoogdWoonmilieuAbf13)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.aantalStudentenwoningen)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.sleutelproject)
    ) {
      return false;
    }
    if (categorieTable === null) {
      return true;
    }
    return categorieTable.rows.every(row => row.valid)
      && categorieTable.yearColumns.every(column => column.valid);
  }

  private static hasInvalidValue(value: number | string | boolean | null | undefined) {
    return typeof value === "undefined" || value === null;
  }

  private static hasEmptyValue(value: number | string | null | undefined) {
    return !value;
  }

}
