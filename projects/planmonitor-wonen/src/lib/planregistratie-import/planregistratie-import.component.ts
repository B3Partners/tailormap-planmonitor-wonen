import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlanregistratieWithDetailsModel } from '../models/planregistratie-with-details.model';
import { PlanregistratiesImportHelper } from '../helpers/planregistraties-import.helper';
import { PlancategorieTableHelper } from '../helpers/plancategorie-table.helper';
import { PlanValidationHelper } from '../helpers/plan-validation.helper';

@Component({
    selector: 'lib-planregistratie-import',
    templateUrl: './planregistratie-import.component.html',
    styleUrls: ['./planregistratie-import.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class PlanregistratieImportComponent {

  private dialogRef = inject<MatDialogRef<PlanregistratieImportComponent>>(MatDialogRef);

  public planregistratie = signal<null | PlanregistratieWithDetailsModel>(null);
  public isValidPlanRegistratie = computed(() => {
    const planregistratie = this.planregistratie();
    if (!planregistratie) {
      return false;
    }
    const table = PlancategorieTableHelper.getPlancategorieTable(planregistratie.plancategorieList, planregistratie.detailplanningList);
    return PlanValidationHelper.validatePlan(planregistratie, table);
  });
  public loadingPlanregistraties = signal(false);
  public importing = signal(false);
  protected acceptedDocumentTypes = [ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel' ];

  public static open(dialog: MatDialog) {
    dialog.open(PlanregistratieImportComponent, {
      width: "400px",
      height: "300px",
    });
  }

  public cancel() {
    this.dialogRef.close();
  }

  public async import() {
  }

  protected onFileSelected($event: Event) {
    const fileInput = $event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.loadingPlanregistraties.set(true);
      PlanregistratiesImportHelper.importExcelFile(file)
        .then(planregistratie => {
          console.log('Imported planregistratie:', planregistratie);
          this.planregistratie.set(planregistratie);
          this.loadingPlanregistraties.set(false);
        })
        .catch(() => {
          this.planregistratie.set(null);
          this.loadingPlanregistraties.set(false);
        });
    }
  }

}
