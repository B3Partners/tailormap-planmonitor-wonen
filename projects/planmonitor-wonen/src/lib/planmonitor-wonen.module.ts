import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponentConfigComponent, ConfigurationComponentRegistryService } from '@tailormap-admin/admin-core';
import { PLANMONITOR_WONEN_COMPONENT_ID } from './models/planmonitor-wonen-component-id';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
})
export class PlanmonitorWonenModule {
  constructor(
    registryService: ConfigurationComponentRegistryService,
  ) {
    registryService.registerConfigurationComponents(PLANMONITOR_WONEN_COMPONENT_ID, 'Planmonitor wonen', BaseComponentConfigComponent);
  }
}
