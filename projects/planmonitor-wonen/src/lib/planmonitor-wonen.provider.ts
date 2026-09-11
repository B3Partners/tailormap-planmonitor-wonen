import { EnvironmentProviders, inject, provideEnvironmentInitializer, Provider } from '@angular/core';
import {
  AdminFieldLocation,
  AdminFieldRegistrationService, BaseComponentConfigComponent, ConfigurationComponentRegistryService,
} from '@tailormap-admin/admin-core';
import { ComponentRegistrationService } from '@tailormap-viewer/core';
import { AutofillDataService } from './services/autofill-data.service';
import { BaseComponentConfigHelper } from '@tailormap-viewer/api';
import { PLANMONITOR_WONEN_COMPONENT_ID } from './models';
import { PlanregistratiesMapComponent } from './planregistraties-map/planregistraties-map.component';
import { PlanmonitorToggleComponent } from './planmonitor-toggle/planmonitor-toggle.component';
import { filter, take } from 'rxjs';
import { PlanmonitorAuthenticationService } from './services/planmonitor-authentication.service';
import { PLANMONITOR_WONEN_API_SERVICE } from './api/planmonitor-wonen-api.service.injection-token';
import { PlanmonitorWonenApiService } from './api/planmonitor-wonen-api.service';

export function planmonitorWonenProvider(): Array<Provider | EnvironmentProviders> {
  return [
    { provide: PLANMONITOR_WONEN_API_SERVICE, useClass: PlanmonitorWonenApiService },
    provideEnvironmentInitializer(() => {
      const adminRegistryService = inject(ConfigurationComponentRegistryService);
      const viewerRegistryService = inject(ComponentRegistrationService);
      const adminFieldRegistrationService = inject(AdminFieldRegistrationService);
      const autofillDataService = inject(AutofillDataService);

      BaseComponentConfigHelper.addDefaultDisabledComponent(PLANMONITOR_WONEN_COMPONENT_ID);
      adminRegistryService.registerConfigurationComponents(PLANMONITOR_WONEN_COMPONENT_ID, 'Planmonitor wonen', BaseComponentConfigComponent);
      viewerRegistryService.registerComponent("map", {
        type: PLANMONITOR_WONEN_COMPONENT_ID,
        component: PlanregistratiesMapComponent,
      }, true);
      viewerRegistryService.registerComponent("map-controls-left", {
        type: PLANMONITOR_WONEN_COMPONENT_ID + '_toggle',
        component: PlanmonitorToggleComponent,
      }, true);
      autofillDataService.loadGemeentes('Zeeland');
      autofillDataService.getGemeentes$()
        .pipe(filter(g => g.length > 0), take(1))
        .subscribe(gemeentes => {
          adminFieldRegistrationService.registerFields(AdminFieldLocation.GROUP, [
            {
              type: "choice",
              label: "Type gebruiker",
              dataType: "string",
              key: PlanmonitorAuthenticationService.TYPE_GEBRUIKER_KEY,
              isPublic: true,
              values: [ PlanmonitorAuthenticationService.TYPE_GEBRUIKER_GEMEENTE, PlanmonitorAuthenticationService.TYPE_GEBRUIKER_PROVINCIE ],
            },
            {
              type: "choice",
              label: "Gemeente",
              dataType: "string",
              key: PlanmonitorAuthenticationService.GEMEENTE_KEY,
              isPublic: true,
              values: gemeentes
                .filter(g => g.provincie === 'Zeeland')
                .map(g => g.naam),
            },
          ]);
        });
    }),
  ];
}
