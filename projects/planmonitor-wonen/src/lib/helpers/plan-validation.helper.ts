import { PlanregistratieModel } from '../models';

export class PlanValidationHelper {

  public static validatePlan(planRegistratie: PlanregistratieModel) {
    if (
      PlanValidationHelper.hasInvalidValue(planRegistratie.Vertrouwelijkheid)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Opdrachtgever_Type)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Jaar_Start_Project)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Oplevering_Eerste)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Oplevering_Laatste)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Plantype)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Status_Project)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Status_Planologisch)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Knelpunten_Meerkeuze)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Regionale_Planlijst)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Toelichting_Knelpunten)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Flexwoningen)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Levensloopbestendig_Ja)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Levensloopbestendig_Nee)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Beoogd_Woonmilieu_ABF5)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Beoogd_Woonmilieu_ABF13)
      || PlanValidationHelper.hasInvalidValue(planRegistratie.Aantal_Studentenwoningen)
    ) {
      return false;
    }
    return true;
  }

  private static hasInvalidValue(value: number | string | null | undefined) {
    return typeof value === "undefined" || value === null;
  }

}
