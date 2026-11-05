import { describe, test, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, ROUTES } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { screen } from '@testing-library/angular';
import { PLANMONITOR_HELP_PATH, planmonitorWonenRoutes } from './planmonitor-wonen.routes';

describe('planmonitorWonenRoutes', () => {

  test('shows the help when added to the root routes', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ROUTES, multi: true, useValue: planmonitorWonenRoutes },
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/' + PLANMONITOR_HELP_PATH);
    expect(screen.getByText('Vertrouwelijkheid')).toBeInTheDocument();
  });

});
