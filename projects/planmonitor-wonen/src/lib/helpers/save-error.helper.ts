import { HttpErrorResponse } from '@angular/common/http';
import { PlanregistratieSaveResultModel } from '../models';

interface ValidationErrorModel {
  field?: string;
  message?: string;
}

export class SaveErrorHelper {

  public static readonly GENERIC_MESSAGE = 'Er is iets mis gegaan bij het opslaan van deze planregistratie. Probeer het opnieuw.';

  /**
   * Converts an error response of a rejected save to a result for the user. The API returns a ProblemDetail with a Dutch
   * `detail` and, for a 400 or 409, `errors: [{field, message}]` with Dutch messages.
   *
   * Messages for the aantallen don't say which categorie they are about, so for those the field is added (for example
   * `aantallen.woningType.Eengezins.gepland`).
   *
   * A 401 or 403 also triggers the `SecurityInterceptor` of tailormap-viewer core (for all URLs under `/api`), which
   * navigates to the login page. The error is still passed on, so the message for it is shown on the login page.
   */
  public static getSaveResult(error: HttpErrorResponse): PlanregistratieSaveResultModel {
    if (error.status === 401) {
      return { success: false, message: 'U bent niet ingelogd. Log opnieuw in en probeer het opnieuw.' };
    }
    if (error.status === 403) {
      return { success: false, message: 'U heeft geen rechten om deze planregistratie op te slaan.' };
    }
    const body: unknown = error.error;
    if (typeof body !== 'object' || body === null) {
      return { success: false, message: SaveErrorHelper.GENERIC_MESSAGE };
    }
    const problem = body as { detail?: unknown; errors?: unknown };
    const errors = Array.isArray(problem.errors)
      ? problem.errors
        .filter((e: unknown): e is ValidationErrorModel => typeof e === 'object' && e !== null && typeof (e as ValidationErrorModel).message === 'string')
        .map(e => SaveErrorHelper.formatError(e))
      : [];
    const message = typeof problem.detail === 'string' && problem.detail && error.status >= 400 && error.status < 500
      ? problem.detail
      : SaveErrorHelper.GENERIC_MESSAGE;
    return errors.length > 0 ? { success: false, message, errors } : { success: false, message };
  }

  private static formatError(error: ValidationErrorModel): string {
    if (error.field?.startsWith('aantallen.')) {
      return `${error.message} (${error.field})`;
    }
    return error.message || '';
  }

}
