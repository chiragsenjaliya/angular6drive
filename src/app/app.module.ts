import { NgModule, APP_INITIALIZER, Injectable } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  L10nConfig,
  L10nLoader,
  LocalizationModule,
  LocaleValidationModule,
  StorageStrategy,
  ProviderType
} from 'angular-l10n';
import { ProtectedGuard } from './auth/auth.guard';


const l10nConfig: L10nConfig = {
  locale: {
    languages: [
      { code: 'en', dir: 'ltr' },
      { code: 'it', dir: 'ltr' },
      { code: 'ar', dir: 'rtl' }
    ],
    defaultLocale: { languageCode: 'en', countryCode: 'US', numberingSystem: 'latn' },
    currency: 'USD',
    storage: StorageStrategy.Cookie,
    cookieExpiration: 30
  },
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: './assets/locale/locale-' }
    ],
    caching: true,
    composedKeySeparator: '.',
    missingValue: 'No key',
    i18nPlural: true
  }
};

// Advanced initialization.
export function initL10n(l10nLoader: L10nLoader): Function {
  return () => l10nLoader.load();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    LocalizationModule.forRoot(l10nConfig),
    LocaleValidationModule.forRoot()
  ],
  providers: [
    Title,
    ProtectedGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true
    }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
