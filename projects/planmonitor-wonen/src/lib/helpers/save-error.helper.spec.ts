import { describe, it, expect } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { SaveErrorHelper } from './save-error.helper';

describe('SaveErrorHelper', () => {

  const errorResponse = (status: number, error: unknown) => new HttpErrorResponse({ status, error });

  it('returns the validation errors of a 400', () => {
    const result = SaveErrorHelper.getSaveResult(errorResponse(400, {
      title: 'Ongeldige planregistratie',
      detail: 'De planregistratie bevat 2 fouten',
      errors: [
        { field: 'geometrie', message: 'Geometrie is verplicht' },
        { field: 'aantallen.woningType.Eengezins.gepland', message: 'Gepland mag niet negatief zijn' },
      ],
    }));
    expect(result).toEqual({
      success: false,
      message: 'De planregistratie bevat 2 fouten',
      errors: [ 'Geometrie is verplicht', 'Gepland mag niet negatief zijn (aantallen.woningType.Eengezins.gepland)' ],
    });
  });

  it('returns the error of a 409 for a plan name in use', () => {
    const message = 'Plannaam "Plan" is al in gebruik';
    const result = SaveErrorHelper.getSaveResult(errorResponse(409, {
      detail: message,
      errors: [{ field: 'planNaam', message }],
    }));
    expect(result).toEqual({ success: false, message, errors: [message] });
  });

  it('returns the detail when there are no validation errors', () => {
    const result = SaveErrorHelper.getSaveResult(errorResponse(400, {
      detail: 'Id in de body komt niet overeen met het id in het pad',
    }));
    expect(result).toEqual({ success: false, message: 'Id in de body komt niet overeen met het id in het pad' });
  });

  it('ignores invalid validation errors', () => {
    const result = SaveErrorHelper.getSaveResult(errorResponse(400, { detail: 'Fout', errors: [ null, 'tekst', { field: 'x' }] }));
    expect(result).toEqual({ success: false, message: 'Fout' });
  });

  it('returns a message for 401 and 403', () => {
    expect(SaveErrorHelper.getSaveResult(errorResponse(401, { detail: 'Niet ingelogd' })).message)
      .toBe('U bent niet ingelogd. Log opnieuw in en probeer het opnieuw.');
    expect(SaveErrorHelper.getSaveResult(errorResponse(403, null)).message)
      .toBe('U heeft geen rechten om deze planregistratie op te slaan.');
  });

  it('returns the generic message for server errors and responses without a problem detail', () => {
    expect(SaveErrorHelper.getSaveResult(errorResponse(500, { detail: 'NullPointerException' })))
      .toEqual({ success: false, message: SaveErrorHelper.GENERIC_MESSAGE });
    expect(SaveErrorHelper.getSaveResult(errorResponse(502, '<html>Bad Gateway</html>')))
      .toEqual({ success: false, message: SaveErrorHelper.GENERIC_MESSAGE });
    expect(SaveErrorHelper.getSaveResult(errorResponse(0, new ProgressEvent('error'))))
      .toEqual({ success: false, message: SaveErrorHelper.GENERIC_MESSAGE });
  });

});
