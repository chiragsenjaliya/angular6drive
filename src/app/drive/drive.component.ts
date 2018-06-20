import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Direction } from "@angular/cdk/bidi";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../auth/auth.service";
import { LocaleService, TranslationService } from "angular-l10n";
import { MatDialog } from "@angular/material";
import { ProcessLoaderDialogComponent } from "./dialog/process-loader-dialog/process-loader-dialog.component";
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
  innerHeight: any;
  innerWidth: any;
  progress;
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

  slug: any;
  subscription: Subscription;

  constructor(
    public locale: LocaleService,
    public translation: TranslationService,
    public title: Title,
    public AuthenticationService: AuthenticationService,
    public dialog: MatDialog,
    public uploadService: UploadService,
    public folderTreeService: FoldertreeService,
    private route: ActivatedRoute
  ) {
    this.innerHeight = window.screen.height;
    this.innerWidth = window.screen.width;
  }

  ngOnInit(): void {
    // When the language changes, refreshes the document title with the new translation.
    this.subscription = this.translation.translationChanged().subscribe(() => {
      this.title.setTitle(this.translation.translate("App.Title"));
    });

    this.folderTreeService.activeNode.subscribe(data => {
      this.slug=data;
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
