import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AdminFieldLocation, AdminFieldRegistrationService, BaseComponentConfigComponent, ConfigurationComponentRegistryService,
} from '@tailormap-admin/admin-core';
import { PLANMONITOR_WONEN_COMPONENT_ID } from './models/planmonitor-wonen-component-id';
import { PlanregistratiesMapComponent } from './planregistraties-map/planregistraties-map.component';
import { ComponentRegistrationService, CoreSharedModule } from '@tailormap-viewer/core';
import { PLANMONITOR_WONEN_API_SERVICE } from './api/planmonitor-wonen-api.service.injection-token';
import { PlanregistratieDialogComponent } from './planregistratie-dialog/planregistratie-dialog.component';
import { SharedModule } from '@tailormap-viewer/shared';
import { PlanregistratieFormComponent } from './planregistratie-form/planregistratie-form.component';
import { PlancategorieListComponent } from './plancategorie-list/plancategorie-list.component';
import { PlanmonitorToggleComponent } from './planmonitor-toggle/planmonitor-toggle.component';
import { PlanmonitorWonenApiService } from './api/planmonitor-wonen-api.service';
import { filter, take } from 'rxjs';
import { AutofillDataService } from './services/autofill-data.service';
import { PlanmonitorAuthenticationService } from './services/planmonitor-authentication.service';
import { PlanregistratieExportComponent } from './planregistratie-export/planregistratie-export.component';


@NgModule({
  declarations: [
    PlanregistratiesMapComponent,
    PlanregistratieDialogComponent,
    PlanregistratieFormComponent,
    PlancategorieListComponent,
    PlanmonitorToggleComponent,
    PlanregistratieExportComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreSharedModule,
  ],
  providers: [
    { provide: PLANMONITOR_WONEN_API_SERVICE, useClass: PlanmonitorWonenApiService },
  ],
})
export class PlanmonitorWonenModule {
  constructor(
    adminRegistryService: ConfigurationComponentRegistryService,
    viewerRegistryService: ComponentRegistrationService,
    adminFieldRegistrationService: AdminFieldRegistrationService,
    autofillDataService: AutofillDataService,
  ) {
    adminRegistryService.registerConfigurationComponents(PLANMONITOR_WONEN_COMPONENT_ID, 'Planmonitor wonen', BaseComponentConfigComponent);
    viewerRegistryService.registerComponent("map", { type: PLANMONITOR_WONEN_COMPONENT_ID, component: PlanregistratiesMapComponent }, true);
    viewerRegistryService.registerComponent("map-controls-left", { type: PLANMONITOR_WONEN_COMPONENT_ID + '_toggle', component: PlanmonitorToggleComponent }, true);
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
  }
}
