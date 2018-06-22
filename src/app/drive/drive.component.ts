import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { AuthenticationService } from "../auth/auth.service";
import { MatDialog } from "@angular/material";
import { UploaddialogComponent } from "./dialog/uploaddialog/uploaddialog.component";
import { UploadService } from "./services/upload.service";
import { FoldertreeService } from "./services/foldertree.service";

@Component({
  selector: "app-drive",
  templateUrl: "./drive.component.html",
  styleUrls: ["./drive.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriveComponent implements OnInit {
  @ViewChild("file") file;
  fileToUpload = [];
  progress;
  slug: any;

  constructor(
    public AuthenticationService: AuthenticationService,
    public dialog: MatDialog,
    public uploadService: UploadService,
    public folderTreeService: FoldertreeService,
  ) { }

  ngOnInit(): void {  

    this.folderTreeService.activeNode.subscribe(data => {
      this.slug=data;
    });
    
  }   

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded(files: FileList) {
    if (files) {   
      this.openUploadDialog(files);
    }
  }

  public openUploadDialog(files) {
    let dialogRef = this.dialog.open(UploaddialogComponent, {
      width: "50%",
      disableClose: false,
      data: { files: files, slug: this.slug }
    });
  }
}
