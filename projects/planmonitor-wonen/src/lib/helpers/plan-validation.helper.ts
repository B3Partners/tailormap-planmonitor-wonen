import { PlanregistratieModel } from '../models';

export class PlanValidationHelper {

  public static validatePlan(planRegistratie: PlanregistratieModel) {
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
      || PlanValidationHelper.hasEmptyValue(planRegistratie.knelpuntenMeerkeuze)
      || PlanValidationHelper.hasEmptyValue(planRegistratie.beoogdWoonmilieuAbf13)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.aantalStudentenwoningen)
    ) {
      return false;
    }
    return true;
  }

  private static hasInvalidValue(value: number | string | null | undefined) {
    return typeof value === "undefined" || value === null;
  }

  private static hasEmptyValue(value: number | string | null | undefined) {
    return !value;
  }

}
