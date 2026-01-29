import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface ImportErrorDialogData {
  errors: string[];
}

@Component({
    selector: 'lib-import-error-dialog',
    templateUrl: './import-error-dialog.component.html',
    styleUrls: ['./import-error-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ImportErrorDialogComponent {
  private dialogRef = inject<MatDialogRef<ImportErrorDialogComponent>>(MatDialogRef);
  public data = inject<ImportErrorDialogData>(MAT_DIALOG_DATA);
  public static open(dialog: MatDialog, errors: string[]) {
    dialog.open(ImportErrorDialogComponent, {
      width: "600px",
      data: { errors },
    });
  }
  public close() {
    this.dialogRef.close();
  }
}
