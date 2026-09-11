import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PlanregistratieWithDetailsModel } from '../models/planregistratie-with-details.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EXPORT_TYPE_LABELS, ExportType, PlanregistratiesExportHelper } from '../helpers/planregistraties-export.helper';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'lib-planregistratie-export',
    templateUrl: './planregistratie-export.component.html',
    styleUrls: ['./planregistratie-export.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatProgressSpinner,
        MatFormField,
        MatSelect,
        ReactiveFormsModule,
        MatOption,
        MatDialogActions,
        MatButton,
        AsyncPipe,
    ],
})
export class PlanregistratieExportComponent implements OnInit {
  private planregistratieService = inject(PlanregistratiesService);
  private dialogRef = inject<MatDialogRef<PlanregistratieExportComponent>>(MatDialogRef);


  private planregistratiesSubject: BehaviorSubject<null | PlanregistratieWithDetailsModel[]> = new BehaviorSubject<null | PlanregistratieWithDetailsModel[]>(null);
  private planregistraties$: Observable<null | PlanregistratieWithDetailsModel[]> = this.planregistratiesSubject.asObservable();
  public planregistratiesAantal$: Observable<number> = this.planregistraties$
    .pipe(map(r => r ? r.length : 0));

  public loadingPlanregistraties = signal(false);
  public exporting = signal(false);

  public exportTypeControl = new FormControl<ExportType>(ExportType.EENVOUDIG, { nonNullable: true });
  public exportType = ExportType;
  public exportTypeLabels = EXPORT_TYPE_LABELS;

  public static open(dialog: MatDialog) {
    dialog.open(PlanregistratieExportComponent, {
      width: "400px",
      height: "300px",
    });
  }

  public ngOnInit(): void {
    this.loadingPlanregistraties.set(true);
    this.planregistratieService.getPlanregistratiesWithDetails$()
      .subscribe(registraties => {
        this.planregistratiesSubject.next(registraties);
        this.loadingPlanregistraties.set(false);
      });
  }

  public cancel() {
    this.dialogRef.close();
  }

  public async export() {
    const exportType = this.exportTypeControl.value;
    this.exporting.set(true);
    const planregistraties = this.planregistratiesSubject.value;
    if (planregistraties) {
      await PlanregistratiesExportHelper.createExcelExport(exportType, planregistraties);
    }
    this.exporting.set(false);
  }

}
