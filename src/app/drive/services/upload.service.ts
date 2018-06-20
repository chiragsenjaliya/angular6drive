import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const url = "http://localhost:8000/api/upload-file";


@Injectable({
  providedIn: "root"
})
export class UploadService {
  constructor(private http: HttpClient) {}

  public upload(files, slug): { [key: string]: Observable<number> } {
    return 
  }
}

