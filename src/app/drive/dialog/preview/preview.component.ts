import { Component, OnInit, Directive, Inject, HostListener, ViewChild } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { FoldertreeService } from "../../services/foldertree.service";
import { AuthenticationService } from "../../../auth/auth.service";
import { VgAPI } from 'videogular2/core';
import * as FileSaver from "file-saver";
import { ProcessLoaderDialogComponent } from "../process-loader-dialog/process-loader-dialog.component";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state("in", style({ opacity: 100 })),
      transition("* => void", [animate(300, style({ opacity: 0 }))])
    ])
  ]
})
export class PreviewComponent implements OnInit {
  @ViewChild("fileviewr") fileviewr;
  public element: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  zoom: number = 1;
  preload: string = "auto";
  api: VgAPI;
  token: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public foldertreeService: FoldertreeService,
    public authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.element = data.file;
    this.authenticationService
      .getAccessToken()
      .subscribe(data => (this.token = data));
  }

  ngOnInit() {}

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
    if (this.zoom < 0.1) {
      this.zoom = 0.1;
    }
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }

  download(element) {
    let dialogRef2 = this.dialog.open(ProcessLoaderDialogComponent, {
      width: "250px",
      data: {},
      disableClose: false
    });
    // Xhr creates new context so we need to create reference to this
    let self = this;
    var pending: boolean = true;

    // Create the Xhr request object
    let xhr = new XMLHttpRequest();

    let url = this.foldertreeService.downloadUrl + "/" + element.id;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", element.type);
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);

    xhr.responseType = "blob";

    // Xhr callback when we get a result back
    // We are not using arrow function because we need the 'this' context
    xhr.onreadystatechange = function() {
      // We use setTimeout to trigger change detection in Zones
      setTimeout(() => {
        pending = false;
      }, 0);

      // If we get an HTTP status OK (200), save the file using fileSaver
      if (xhr.readyState === 4 && xhr.status === 200) {
        var blob = new Blob([this.response], { type: element.type });
        FileSaver.saveAs(blob, element.name);
        dialogRef2.close();
      }
    };

    // Start the Ajax request
    xhr.send(JSON.stringify(element));
  }

  downloadFile(data: Response, mime) {
    let blob = new Blob([data], { type: mime });
    FileSaver.saveAs(blob, this.element.name);
  }
}
