import { PlanregistratieModel } from '../models';

export class PlanValidationHelper {

  public static validatePlan(planRegistratie: PlanregistratieModel) {
    if (
      PlanValidationHelper.hasInvalidValue(planRegistratie.vertrouwelijkheid)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.opdrachtgeverType)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.jaarStartProject)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.opleveringEerste)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.opleveringLaatste)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.plantype)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.statusProject)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.statusPlanologisch)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.knelpuntenMeerkeuze)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.regionalePlanlijst)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.toelichtingKnelpunten)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.flexwoningen)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.levensloopbestendigJa)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.levensloopbestendigNee)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.beoogdWoonmilieuAbf5)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.beoogdWoonmilieuAbf13)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.aantalStudentenwoningen)
    ) {
      return false;
    }
    return true;
  }

  private static hasInvalidValue(value: number | string | null | undefined) {
    return typeof value === "undefined" || value === null;
  }

}
