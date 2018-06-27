import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { FoldertreeService } from '../../services/foldertree.service';
import { MatMenuTrigger, MatDialog } from "@angular/material";
import { UploadService } from "../../services/upload.service";
import { ProcessLoaderDialogComponent } from "../../dialog/process-loader-dialog/process-loader-dialog.component";
import { UploaddialogComponent } from "../../dialog/uploaddialog/uploaddialog.component";
import { PreviewComponent } from "../../dialog/preview/preview.component";

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
  public direction = "up";
  public animationMode = "fling";
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
      this.foldertreeService.createUploadtry.subscribe(data => {
        if (data == 0 || data) {
          if (data == 0) {
            data = "";
          }
          this.foldertreeService.createUploadtry.next(null);
        }
      });
    });

    this.foldertreeService.isUpload.subscribe(data => {
      if (data) {
        this.foldertreeService.getFolders(this.paramval).subscribe(result => {
          this.folders = result.data.folderfile;
          this.foldercrumbs = result.data.breadcrumb;
          if (result.data) {
            this.ref.markForCheck();
          }
        });
      }
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
      menu.style.left = event.pageX + "px";
      menu.style.top = event.pageY + "px";
    } else {
      var menu = document.getElementById("folderfilemenu");
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
      this.openUploadDialog(files, this.paramval);
    }
  }

  createFolder(element: any = null) {
    if (element) {
      this.foldertreeService.createFoldertry.next(element.id);
    } else {
      if (this.paramval == "") {
        this.paramval = 0;
      }
      this.foldertreeService.createFoldertry.next(this.paramval);
    }
  }

  uploadFile() {
    this.addFiles();
  }

  openPreview(element){
    let dialogRef = this.dialog.open(PreviewComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      disableClose: false,
      data: { file: element }
    });
  }

  public openUploadDialog(files, slug) {
    let dialogRef = this.dialog.open(UploaddialogComponent, {
      width: "50%",
      disableClose: true,
      data: { files: files, slug: slug }
    });
  }
}
