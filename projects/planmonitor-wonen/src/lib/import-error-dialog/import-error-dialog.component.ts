import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

export interface ImportErrorDialogData {
  errors: string[];
}

@Component({
    selector: 'lib-import-error-dialog',
    templateUrl: './import-error-dialog.component.html',
    styleUrls: ['./import-error-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
    ],
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
