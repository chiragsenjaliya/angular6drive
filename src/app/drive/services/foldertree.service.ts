import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { of, Observable} from "rxjs";
import { tap, map, switchMap, catchError,  } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})

export class FoldertreeService {
  public foldrertreeUrl = environment.serverapiUrl + "folder-tree";
  public createFolderUrl = environment.serverapiUrl + "create-folder";
  public getFoldersUrl = environment.serverapiUrl + "get-folders-files";
  public nodes: any;

  constructor(private http: HttpClient) {}

  /**
   * Get Folder Tree Data
   */

  public foldrertree(nodeId): any {
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
    const folderdata = {
      parent_id: nodeId,
      name: name
    };
    return this.http
      .post(this.createFolderUrl, folderdata)
      .pipe(map(data => data));
  }

  /**
   * Get Folders
   */

  public getFolders(parent_id): Observable<any> {
    return this.http
      .get(this.getFoldersUrl + "/" + parent_id).pipe(
        catchError((error: any) => Observable.throw(error))
    );
  }
}
