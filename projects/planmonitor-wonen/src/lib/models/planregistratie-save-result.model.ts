export interface PlanregistratieSaveResultModel {
  success: boolean;
  /** Message for the user when the save failed */
  message?: string;
  /** Validation errors returned by the API when the save was rejected */
  errors?: string[];
}
