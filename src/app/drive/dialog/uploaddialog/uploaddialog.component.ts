import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import {  Subscription, of } from 'rxjs';
import { catchError, last, map, tap } from "rxjs/operators";
import { jsonpCallbackContext } from "@angular/common/http/src/module";

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  uploaded: number;
  canRetry: boolean;
  canCancel: boolean;
  isuploaded:boolean;
  sub?: Subscription;
}

@Component({
  selector: "app-uploaddialog",
  templateUrl: "./uploaddialog.component.html",
  styleUrls: ["./uploaddialog.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state("in", style({ opacity: 100 })),
      transition("* => void", [animate(300, style({ opacity: 0 }))])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploaddialogComponent implements OnInit {
  /** Link text */
  @Input() text = "Upload";
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = "file";
  /** Target URL for file uploading. */
  @Input() target = "http://localhost:8000/api/upload-file";
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();
  private files: Array<FileUploadModel> = [];
  slug: any;

  constructor(
    public dialogRef: MatDialogRef<UploaddialogComponent>,
    private _http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: ChangeDetectorRef
  ) {
    for (let index = 0; index < data.files.length; index++) {
      const file: File = data.files[index];
      this.files.push({
        data: file,
        state: "in",
        inProgress: false,
        progress: 0,
        uploaded: 0,
        canRetry: false,
        canCancel: true,
        isuploaded:false,
      });
    }
    this.slug = data.slug;
  }
  ngOnInit() {
    this.ref.detectChanges();
    this.uploadFiles();
  }

  private uploadFiles() {
    this.files.forEach((file, key) => {
      this.uploadFile(key);
    });
  }

  uploadFile(index) {    
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Accept", "application/json");
    const formData = new FormData();

    formData.append("fileItem", this.files[index].data, this.files[index].data.name);
    formData.append("slug", this.slug);

    const req = new HttpRequest("POST", this.target, formData, {
      headers,
      reportProgress: true
    });
    this.files[index].inProgress = true;
    this.ref.detectChanges();
    this.files[index].sub = this._http
      .request(req)
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.files[index].progress = Math.round((event.loaded * 100) / event.total); 
              this.files[index].uploaded = event.loaded;       
              this.ref.detectChanges();
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        tap(message => {}),
        last(),
        catchError((error: HttpErrorResponse) => {
          this.files[index].inProgress = false;
          this.files[index].canRetry = true;
          this.ref.detectChanges();
          return of(`${this.files[index].data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === "object") {          
          this.files[index].canCancel = false;
          this.files[index].canRetry = false;
          this.files[index].isuploaded = true;
          this.ref.detectChanges();
        }
      });
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  closeDialog() {}
}
