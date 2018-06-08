import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import { NgProgress, NgProgressRef } from "@ngx-progressbar/core";
import {
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationEnd
} from "@angular/router";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state("in", style({ opacity: 0 })),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(300, style({ opacity: 0 }))
      ]),
      transition(":enter", [
        style({ opacity: 0 }),
        animate(5, style({ opacity: 1 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class AppComponent implements OnInit {
  progressRef: NgProgressRef;

  title = "app";
  constructor(
    public ngProgress: NgProgress,
    public router: Router,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.progressRef = this.ngProgress.ref("ng-progrss");
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.progressRef.start();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        this.progressRef.complete();
      }
    });
  }
}
