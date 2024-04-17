import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponentConfigComponent, ConfigurationComponentRegistryService } from '@tailormap-admin/admin-core';
import { PLANMONITOR_WONEN_COMPONENT_ID } from './models/planmonitor-wonen-component-id';
import { PlanmonitorWonenFeaturesComponent } from './planmonitor-wonen-features/planmonitor-wonen-features.component';
import { ComponentRegistrationService } from '@tailormap-viewer/core';
import { PLANMONITOR_WONEN_API_SERVICE } from './services/planmonitor-wonen-api.service.injection-token';
import { PlanmonitorWonenApiMockService } from './services/planmonitor-wonen-api-mock.service';



@NgModule({
  declarations: [
    PlanmonitorWonenFeaturesComponent,
  ],
  imports: [
    CommonModule,
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
    viewerRegistryService.registerComponent("map", { type: PLANMONITOR_WONEN_COMPONENT_ID, component: PlanmonitorWonenFeaturesComponent }, true);
  }
}
