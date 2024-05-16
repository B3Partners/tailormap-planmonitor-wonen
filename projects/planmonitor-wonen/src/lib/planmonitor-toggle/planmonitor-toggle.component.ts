import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { map, Observable } from 'rxjs';
import { LayoutService } from '@tailormap-viewer/core';
import { PLANMONITOR_WONEN_COMPONENT_ID } from '../models';

@Component({
  selector: 'lib-planmonitor-toggle',
  templateUrl: './planmonitor-toggle.component.html',
  styleUrls: ['./planmonitor-toggle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanmonitorToggleComponent {

  public activeToggle$: Observable<string>;
  public toolActive$: Observable<boolean>;

  constructor(
    private planregistratieService: PlanregistratiesService,
    private layoutService: LayoutService,
  ) {
    this.toolActive$ = this.layoutService.componentsConfig$
      .pipe(map(config => this.layoutService.isComponentEnabled(config, PLANMONITOR_WONEN_COMPONENT_ID)));
    this.activeToggle$ = this.planregistratieService.isCreatingNewPlan$()
      .pipe(map(creatingNewPlan => creatingNewPlan ? 'create' : 'edit'));
  }

  public toggleChanged($event: MatButtonToggleChange) {
    this.planregistratieService.setCreateNewPlan($event.value === 'create');
  }

}
