import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Direction } from "@angular/cdk/bidi";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../auth/auth.service";
import { LocaleService, TranslationService } from "angular-l10n";

@Component({
  selector: "app-drive",
  templateUrl: "./drive.component.html",
  styleUrls: ["./drive.component.scss"]
})
export class DriveComponent implements OnInit {
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

  dir: Direction;

  subscription: Subscription;

  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    public title: Title,
    public AuthenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // When the language changes, refreshes the document title with the new translation.
    this.subscription = this.translation.translationChanged().subscribe(() => {
      this.title.setTitle(this.translation.translate("App.Title"));
    });
   
    // Initializes direction.
    this.dir = this.getLanguageDirection();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
