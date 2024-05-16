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

  public disableSave$: Observable<boolean>;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.panelWidth = (BrowserHelper.getScreenWith() * 0.7) - this.panelWidthMargin;
  }

  constructor(
    private planregistratieService: PlanregistratiesService,
  ) {
    this.selectedPlan$ = this.planregistratieService.getSelectedPlanregistratie$();
    this.dialogOpen$ = this.selectedPlan$.pipe(map(plan => !!plan));
    this.dialogTitle$ = this.selectedPlan$.pipe(map(plan => {
      return plan ? `Planregistratie ${plan.planNaam}` : 'Planregistratie';
    }));
    this.disableSave$ = this.planregistratieService.hasValidChangedPlan$()
      .pipe(map(validPlan => !validPlan));
    this.onResize();
  }

  public closeDialog() {
    this.cancel();
  }

  public expandCollapseDialog() {
    this.dialogCollapsed.next(!this.dialogCollapsed.value);
  }

  public planregistratieChanged(updatedPlan: Partial<PlanregistratieModel> | null) {
    this.planregistratieService.updatePlan(updatedPlan);
  }

  public save() {
    this.planregistratieService.save$().subscribe(_success => {
      console.log('Saved', _success);
    });
  }

  public cancel() {
    this.planregistratieService.cancelChanges();
  }

}
