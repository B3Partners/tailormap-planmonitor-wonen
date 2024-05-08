import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-planmonitor-toggle',
  templateUrl: './planmonitor-toggle.component.html',
  styleUrls: ['./planmonitor-toggle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanmonitorToggleComponent {

  public activeToggle$: Observable<string>;

  constructor(
    private planregistratieService: PlanregistratiesService,
  ) {
    this.activeToggle$ = this.planregistratieService.isCreatingNewPlan$()
      .pipe(map(creatingNewPlan => creatingNewPlan ? 'create' : 'edit'));
  }

  public toggleChanged($event: MatButtonToggleChange) {
    this.planregistratieService.setCreateNewPlan($event.value === 'create');
  }

}
