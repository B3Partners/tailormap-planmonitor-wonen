import { Component, ChangeDetectionStrategy, HostListener, signal } from '@angular/core';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import {
  BrowserHelper, ConfirmDialogService, CssHelper, SnackBarMessageComponent, SnackBarMessageOptionsModel,
} from '@tailormap-viewer/shared';
import { PlanregistratieModel } from '../models';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  public saving = signal(false);

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.panelWidth = (BrowserHelper.getScreenWith() * 0.7) - this.panelWidthMargin;
  }

  constructor(
    private planregistratieService: PlanregistratiesService,
    private matSnackBar: MatSnackBar,
    private confirmDialogService: ConfirmDialogService,
    // private mapService: MapService,
  ) {
    this.selectedPlan$ = this.planregistratieService.getSelectedPlanregistratie$();
    this.dialogOpen$ = this.selectedPlan$
      .pipe(
        tap(plan => {
          document.body.classList.toggle('planmonitor-wonen-dialog-open', !!plan);
          // if (plan) {
          //   this.mapService.zoomTo(plan.geometrie, ProjectionCodesEnum.RD);
          // }
        }),
        map(plan => !!plan),
      );
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

  public save(closeAfterSaving?: boolean) {
    this.saving.set(true);
    this.planregistratieService.save$().subscribe(success => {
      this.saving.set(false);
      const config: SnackBarMessageOptionsModel = {
        message: success ? 'Planregistratie opgeslagen' : 'Er is iets mis gegaan bij het opslaan van deze planregistratie. Probeer het opnieuw.',
        duration: 5000,
        showDuration: true,
        showCloseButton: true,
      };
      SnackBarMessageComponent.open$(this.matSnackBar, config).subscribe();
      if (success && closeAfterSaving) {
        this.cancel();
      }
    });
  }

  public cancel() {
    this.planregistratieService.cancelChanges();
  }

  public delete(registratieId: string) {
    this.confirmDialogService.confirm$(
      'Planregistratie verwijderen',
      'Weet u zeker dat u deze planregistratie wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
      true,
      'Ja, verwijder',
    )
      .pipe(
        take(1),
        filter(confirm => confirm),
        switchMap(() => this.planregistratieService.delete$(registratieId)),
      )
      .subscribe(success => {
        const config: SnackBarMessageOptionsModel = {
          message: success ? 'Planregistratie verwijderd' : 'Er is iets mis gegaan bij het verwijderen van deze planregistratie. Probeer het opnieuw.',
          duration: 5000,
          showDuration: true,
          showCloseButton: true,
        };
        SnackBarMessageComponent.open$(this.matSnackBar, config).subscribe();
      });
  }
}
