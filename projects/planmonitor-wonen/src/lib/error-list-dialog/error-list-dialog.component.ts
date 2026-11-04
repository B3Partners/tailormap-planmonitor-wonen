import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

export interface ErrorListDialogData {
  title: string;
  /** Text above the errors */
  description: string;
  errors: string[];
}

@Component({
    selector: 'lib-error-list-dialog',
    templateUrl: './error-list-dialog.component.html',
    styleUrls: ['./error-list-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
    ],
})
export class ErrorListDialogComponent {
  private dialogRef = inject<MatDialogRef<ErrorListDialogComponent>>(MatDialogRef);
  public data = inject<ErrorListDialogData>(MAT_DIALOG_DATA);
  public static open(dialog: MatDialog, data: ErrorListDialogData) {
    dialog.open(ErrorListDialogComponent, {
      width: "600px",
      data,
    });
  }
  public close() {
    this.dialogRef.close();
  }
}
