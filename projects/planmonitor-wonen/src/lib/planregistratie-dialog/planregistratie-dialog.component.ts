import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { BrowserHelper, CssHelper } from '@tailormap-viewer/shared';
import { PlanregistratieModel } from '../models';

@Component({
  selector: 'lib-planregistratie-dialog',
  templateUrl: './planregistratie-dialog.component.html',
  styleUrls: ['./planregistratie-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanregistratieDialogComponent {

  public selectedPlan$: Observable<PlanregistratieModel | null>;
  public dialogOpen$: Observable<boolean>;

  private bodyMargin = CssHelper.getCssVariableValueNumeric('--body-margin');
  public panelWidthMargin = CssHelper.getCssVariableValueNumeric('--menubar-width') + (this.bodyMargin * 2);
  public panelWidth = 300;

  public dialogTitle$: Observable<string> = of('');
  private dialogCollapsed = new BehaviorSubject(false);
  public dialogCollapsed$ = this.dialogCollapsed.asObservable();

  public formValid = false;

  public formChanged = false;
  private updatedPlan: PlanregistratieModel | null = null;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.panelWidth = (BrowserHelper.getScreenWith() * 0.5) - this.panelWidthMargin;
  }

  constructor(
    private planregistratieService: PlanregistratiesService,
  ) {
    this.selectedPlan$ = this.planregistratieService.getSelectedPlanregistratie$();
    this.dialogOpen$ = this.selectedPlan$.pipe(map(plan => !!plan));
    this.dialogTitle$ = this.selectedPlan$.pipe(map(plan => {
      return plan ? `Planregistratie ${plan.Plannaam}` : 'Planregistratie';
    }));
    this.onResize();
  }

  public closeDialog() {
    this.planregistratieService.setSelectedPlanregistratie(null);
  }

  public expandCollapseDialog() {
    this.dialogCollapsed.next(!this.dialogCollapsed.value);
  }

  public planregistratieValidChanged(valid: boolean) {
    this.formValid = valid;
  }

  public planregistratieChanged(updatedPlan: PlanregistratieModel | null) {
    this.formChanged = true;
    this.updatedPlan = updatedPlan;
  }

  public save() {
    if (this.updatedPlan === null) {
      return;
    }
    this.planregistratieService.updatePlan$(this.updatedPlan)
      .subscribe(() => {
        this.formChanged = false;
        this.updatedPlan = null;
      });
  }

}
