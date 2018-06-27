import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import {  map, catchError,  } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FoldertreeService {
  public foldrertreeUrl = environment.serverapiUrl + "folder-tree";
  public createFolderUrl = environment.serverapiUrl + "create-folder";
  public getFoldersUrl = environment.serverapiUrl + "get-folders-files";
  public downloadUrl = environment.serverapiUrl + "file-download";
  public nodes: any;
  public isFolderCreated = new Subject();
  public activeNode = new Subject();
  public isUpload = new Subject();
  public createFoldertry = new Subject();
  public createUploadtry = new Subject(); 

  constructor(private http: HttpClient) {}

  public setisFolderCreated(data: any) {
    this.isFolderCreated.next(data);
  }

  public getisFolderCreated(): Observable<any> {
    return this.isFolderCreated.asObservable();
  }

  /**
   * Get Folder Tree Data
   */

  public foldrertree(nodeId): any {
    if (nodeId == 0) {
      nodeId = "";
    }
    return this.http
      .get(this.foldrertreeUrl + "/" + nodeId)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }

  /**
   * Create Folder
   */

  public createFolder(nodeId, name): any {
    if (nodeId == 0) {
      nodeId = "";
    }
    const folderdata = {
      slug: nodeId,
      name: name
    };
    return this.http
      .post(this.createFolderUrl, folderdata)
      .pipe(map(data => data));
  }

  /**
   * Get Folders
   */

  public getFolders(slug): Observable<any> {
    if (slug == 0) {
      slug = "";
    }
    return this.http
      .get(this.getFoldersUrl + "/" + slug)
      .pipe(catchError((error: any) => Observable.throw(error)));
  }

  /**
   * file-download
   */
  public fileDownload(slug): Observable<any> {
    if (slug == 0) {
      slug = "";
    }
    return this.http
      .get(this.downloadUrl + "/" + slug)
      .pipe();
  }
  
}
