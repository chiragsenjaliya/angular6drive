import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Direction } from "@angular/cdk/bidi";
import { LocaleService, TranslationService } from "angular-l10n";
import { AuthenticationService } from "./auth/auth.service";
import { NgProgress, NgProgressRef } from "@ngx-progressbar/core";
import { map } from "rxjs/operators";
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
import { Subscription } from "rxjs";

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
  countryMenuItems: any[] = [
    {
      text: "EN",
      language: "en",
      country: "US",
      currency: "USD",
      numberingSystem: "latn"
    },
    {
      text: "IT",
      language: "it",
      country: "IT",
      currency: "EUR",
      numberingSystem: "latn"
    }
  ];

  get currentCountry(): string {
    return this.locale.getCurrentCountry();
  }

  get currentNumberingSystem(): string {
    return this.locale.getCurrentNumberingSystem();
  }
  subscription: Subscription;
  dir: Direction;
  isAuth: boolean = false;

  constructor(
    public AuthenticationService: AuthenticationService,
    public ngProgress: NgProgress,
    public router: Router,
    public cdr: ChangeDetectorRef,
    public locale: LocaleService,
    public translation: TranslationService,
    public title: Title
  ) {}

  ngOnInit() {
    this.progressRef = this.ngProgress.ref("ng-progrss");
    this.AuthenticationService.isAuthorized().subscribe(
      data => (this.isAuth = data)
    );
    // Initializes direction.
    this.dir = this.getLanguageDirection();
    this.subscription = this.translation.translationChanged().subscribe(() => {
      this.title.setTitle(this.translation.translate("App.Title"));
    });
  }

  getLanguageDirection(language?: string): Direction {
    return this.locale.getLanguageDirection(language) as Direction;
  }

  selectLocale(
    language: string,
    country: string,
    currency: string,
    numberingSystem: string
  ): void {
    this.locale.setDefaultLocale(language, country, "", numberingSystem);
    this.locale.setCurrentCurrency(currency);
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
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
