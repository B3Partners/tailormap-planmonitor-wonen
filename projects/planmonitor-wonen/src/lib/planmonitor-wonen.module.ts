import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponentConfigComponent, ConfigurationComponentRegistryService } from '@tailormap-admin/admin-core';
import { PLANMONITOR_WONEN_COMPONENT_ID } from './models/planmonitor-wonen-component-id';
import { PlanregistratiesMapComponent } from './planregistraties-map/planregistraties-map.component';
import { ComponentRegistrationService } from '@tailormap-viewer/core';
import { PLANMONITOR_WONEN_API_SERVICE } from './services/planmonitor-wonen-api.service.injection-token';
import { PlanmonitorWonenApiMockService } from './services/planmonitor-wonen-api-mock.service';
import { PlanregistratieDialogComponent } from './planregistratie-dialog/planregistratie-dialog.component';
import { SharedModule } from '@tailormap-viewer/shared';
import { PlanregistratieFormComponent } from './planregistratie-form/planregistratie-form.component';
import { PlancategorieListComponent } from './plancategorie-list/plancategorie-list.component';



@NgModule({
  declarations: [
    PlanregistratiesMapComponent,
    PlanregistratieDialogComponent,
    PlanregistratieFormComponent,
    PlancategorieListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [
    { provide: PLANMONITOR_WONEN_API_SERVICE, useClass: PlanmonitorWonenApiMockService },
  ],
})
export class PlanmonitorWonenModule {
  constructor(
    adminRegistryService: ConfigurationComponentRegistryService,
    viewerRegistryService: ComponentRegistrationService,
  ) {
    adminRegistryService.registerConfigurationComponents(PLANMONITOR_WONEN_COMPONENT_ID, 'Planmonitor wonen', BaseComponentConfigComponent);
    viewerRegistryService.registerComponent("map", { type: PLANMONITOR_WONEN_COMPONENT_ID, component: PlanregistratiesMapComponent }, true);
  }
}