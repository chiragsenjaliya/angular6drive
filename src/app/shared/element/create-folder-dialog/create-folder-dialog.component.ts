import { Component, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
@Component({
  selector: "app-create-folder-dialog",
  templateUrl: "./create-folder-dialog.component.html"
})
export class CreateFolderDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
