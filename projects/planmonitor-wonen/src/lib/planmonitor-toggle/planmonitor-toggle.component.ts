import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { map, Observable } from 'rxjs';
import { LayoutService } from '@tailormap-viewer/core';
import { PLANMONITOR_WONEN_COMPONENT_ID } from '../models';
import { PlanmonitorAuthenticationService } from '../services/planmonitor-authentication.service';
import { PlanregistratieExportComponent } from '../planregistratie-export/planregistratie-export.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'lib-planmonitor-toggle',
    templateUrl: './planmonitor-toggle.component.html',
    styleUrls: ['./planmonitor-toggle.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class PlanmonitorToggleComponent {
  private planregistratieService = inject(PlanregistratiesService);
  private layoutService = inject(LayoutService);
  private planmonitorAuthenticationService = inject(PlanmonitorAuthenticationService);
  private dialog = inject(MatDialog);


  public activeToggle$: Observable<string>;
  public toolActive$: Observable<boolean>;
  public isGemeenteGebruiker$ = this.planmonitorAuthenticationService.isGemeenteGebruiker$;
  public isGemeenteOrProvincieGebruiker$ = this.planmonitorAuthenticationService.isGemeenteOrProvincieGebruiker$;

  constructor() {
    this.toolActive$ = this.layoutService.componentsConfig$
      .pipe(map(config => this.layoutService.isComponentEnabled(config, PLANMONITOR_WONEN_COMPONENT_ID)));
    this.activeToggle$ = this.planregistratieService.isCreatingNewPlan$()
      .pipe(map(creatingNewPlan => creatingNewPlan ? 'create' : 'edit'));
  }

  public toggleChanged($event: MatButtonToggleChange) {
    this.planregistratieService.setCreateNewPlan($event.value === 'create');
  }

  public exportPlannen() {
    PlanregistratieExportComponent.open(this.dialog);
  }

}
