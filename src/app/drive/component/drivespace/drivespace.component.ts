import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { FoldertreeService } from '../../services/foldertree.service';
import { MatMenuTrigger, MatDialog } from "@angular/material";
import { UploadService } from "../../services/upload.service";
import { ProcessLoaderDialogComponent } from "../../dialog/process-loader-dialog/process-loader-dialog.component";
import { UploaddialogComponent } from "../../dialog/uploaddialog/uploaddialog.component";

@Component({
  selector: "app-drivespace",
  templateUrl: "./drivespace.component.html",
  styleUrls: ["./drivespace.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrivespaceComponent implements OnInit {
  folders: any;
  foldercrumbs: any;
  paramval: any;
  @ViewChild("file") file;

  public open = false;
  public spin = false;
  public direction = 'up';
  public animationMode = 'fling';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private foldertreeService: FoldertreeService,
    private dialog: MatDialog,
    public uploadService: UploadService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      setTimeout(() =>
        this.dialog.open(ProcessLoaderDialogComponent, {
          width: "250px",
          disableClose: true,
          data: {}
        })
      );
      if (!params["id"]) {
        this.paramval = "";
        this.getFileFolders();
      } else {
        this.paramval = params["id"];
        this.getFileFolders(params["id"]);
      }
      this.foldertreeService.activeNode.next(this.paramval);
      this.foldertreeService.isFolderCreated.subscribe(
        data => {
          if (data) {           
            this.getFileFolders(this.paramval);
            this.foldertreeService.isFolderCreated.next(false);
          }
        },
        error => console.log(error)
      );
    });
  }

  getFileFolders(id = "") {
    this.foldertreeService.getFolders(id).subscribe(result => {
      this.folders = result.data.folderfile;
      this.foldercrumbs = result.data.breadcrumb;
      if (result.data) {
        this.ref.markForCheck();
      }
      setTimeout(() => this.dialog.closeAll());
    });
  }
  navigate(element) {
    this.router.navigate(["/drive/folder", element.id]);
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger, ismainMenu = false) {
    if (ismainMenu) {
      var menu = document.getElementById("mainmenu");
      menu.style.display = "";
      menu.style.position = "absolute";
      menu.style.left = event.pageX + 5 + "px";
      menu.style.top = event.pageY + 5 + "px";
    }
    viewChild.openMenu();
    event.preventDefault();
    event.stopPropagation();
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
      data: { files: files, slug: this.paramval }
    });
  }

}
