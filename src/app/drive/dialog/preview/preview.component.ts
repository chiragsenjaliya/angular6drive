import { Component, OnInit, Directive, Inject, HostListener, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.element = data.file;
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
      this.zoom=0.1;
    } 
  }
}
