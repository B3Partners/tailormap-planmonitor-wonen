import { Routes } from '@angular/router';
import { PlanmonitorHelpComponent } from './planmonitor-help/planmonitor-help.component';

export const PLANMONITOR_HELP_PATH = 'ext/planmonitor/planmonitor-help';

/**
 * Routes added to the Tailormap routes via the ROUTES token in planmonitorWonenProvider(). The help is opened in a
 * separate window by the planregistratie dialog.
 */
export const planmonitorWonenRoutes: Routes = [
  { path: PLANMONITOR_HELP_PATH, component: PlanmonitorHelpComponent },
];
