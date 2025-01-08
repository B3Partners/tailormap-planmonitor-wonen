import { Component, ChangeDetectionStrategy, HostListener, signal, DestroyRef } from '@angular/core';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import {
  BrowserHelper, ConfirmDialogService, CssHelper, SnackBarMessageComponent, SnackBarMessageOptionsModel,
} from '@tailormap-viewer/shared';
import { PlanregistratieModel } from '../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanmonitorAuthenticationService } from '../services/planmonitor-authentication.service';
import { MapService, ProjectionCodesEnum } from '@tailormap-viewer/map';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  public panelWidth = this.getPanelWidth();

  public dialogTitle$: Observable<string> = of('');
  private dialogCollapsed = new BehaviorSubject(false);
  public dialogCollapsed$ = this.dialogCollapsed.asObservable();

  public disableSave$: Observable<boolean>;

  public saving = signal(false);
  public savingAndClosing = signal(false);
  public isGemeenteGebruiker$: Observable<boolean>;
  private lastWindow: Window | undefined | null;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.panelWidth = this.getPanelWidth();
  }

  constructor(
    private planregistratieService: PlanregistratiesService,
    private matSnackBar: MatSnackBar,
    private confirmDialogService: ConfirmDialogService,
    private planmonitorAuthenticationService: PlanmonitorAuthenticationService,
    private mapService: MapService,
    private destroyRef: DestroyRef,
  ) {
    this.isGemeenteGebruiker$ = this.planmonitorAuthenticationService.isGemeenteGebruiker$;
    this.selectedPlan$ = this.planregistratieService.getSelectedPlanregistratie$();
    this.dialogOpen$ = this.selectedPlan$
      .pipe(
        map(plan => !!plan),
        tap(dialogOpen => {
          document.body.classList.toggle('planmonitor-wonen-dialog-open', dialogOpen);
        }),
      );
    this.selectedPlan$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged((prev, current) => {
          return prev?.id === current?.id;
        }),
        debounceTime(0),
      )
      .subscribe(plan => {
        if (plan) {
          this.mapService.zoomTo(plan.geometrie, ProjectionCodesEnum.RD);
        }
      });
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
    if (closeAfterSaving) {
      this.savingAndClosing.set(true);
    } else {
      this.saving.set(true);
    }
    this.planregistratieService.save$().subscribe(success => {
      if (closeAfterSaving) {
        this.savingAndClosing.set(false);
      } else {
        this.saving.set(false);
      }
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

  private getPanelWidth() {
    return (BrowserHelper.getScreenWith() * 0.7) - this.panelWidthMargin;
  }

  public showHelp($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.lastWindow) {
      this.lastWindow.close();
    }
    const baseUrl = window.location.protocol + "//" + window.location.host;
    this.lastWindow = window.open(baseUrl + '/ext/planmonitor/planmonitor-help', '', 'width=600,height=300');
  }

}
