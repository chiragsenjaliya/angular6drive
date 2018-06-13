import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { FoldertreeService } from '../../services/foldertree.service';
import { MatMenuTrigger, MatDialog } from "@angular/material";
import { ProcessLoaderDialogComponent } from "../../../shared/element/process-loader-dialog/process-loader-dialog.component";
@Component({
  selector: "app-drivespace",
  templateUrl: "./drivespace.component.html",
  styleUrls: ["./drivespace.component.scss"]
})
export class DrivespaceComponent implements OnInit {
  folders: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private foldertreeService: FoldertreeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let dialogRef2 = this.dialog.open(ProcessLoaderDialogComponent, {
        width: "250px",
        data: {}
      });
      this.foldertreeService.getFolders(params["id"]).subscribe(result => {
        this.folders = result.data;
        this.ref.markForCheck();
        dialogRef2.close();
      });
    });
  }

  navigate(element) {
    this.router.navigate(["/drive", element.id]);
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }
}
