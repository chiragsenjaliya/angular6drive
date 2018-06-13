import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, map, switchMap, catchError} from "rxjs/operators";
import { environment } from "../../environments/environment";

import { TokenStorage } from "../shared/services/token-storage.service";

interface AccessData {
  access_token: string;
  expires_in:string;
  refresh_oken: string;
  token_type: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  public registerurl = environment.serverapiUrl + "register";
  public loginurl = environment.serverUrl + "oauth/token";
  public logouturl = environment.serverapiUrl + "logout";

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns {Observable<boolean>}
   * @memberOf AuthService
   */
  public isAuthorized(): Observable<boolean> {
    return this.tokenStorage.getAccessToken().pipe(map(token => !!token));
  }

  /**
   * Get access token
   * @description Should return access token in Observable from e.g.
   * localStorage
   * @returns {Observable<string>}
   */
  public getAccessToken(): Observable<string> {
    return this.tokenStorage.getAccessToken();
  }

  /**
   * Function, that should perform refresh token verifyTokenRequest
   * @description Should be successfully completed so interceptor
   * can execute pending requests or retry original one
   * @returns {Observable<any>}
   */
  public refreshToken(): Observable<AccessData> {
    return this.tokenStorage.getRefreshToken().pipe(
      switchMap((refreshToken: string) =>
        this.http.post(this.loginurl, {
          grant_type: environment.GRANT_TYPE,
          refresh_token: refreshToken,
          client_id: environment.CLIENT_ID,
          client_secret: environment.CLIENT_SECRET,
          provider: environment.provider
        })
      ),
      tap((tokens: AccessData) => this.saveAccessData(tokens)),
      catchError(err => {
        this.logout();
        return Observable.throw(err);
      })
    );
  }

  /**
   * Function, checks response of failed request to determine,
   * whether token be refreshed or not.
   * @description Essentialy checks status
   * @param {Response} response
   * @returns {boolean}
   */
  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return response.status === 401;
  }

  /**
   * Verify that outgoing request is refresh-token,
   * so interceptor won't intercept this request
   * @param {string} url
   * @returns {boolean}
   */
  public verifyTokenRequest(url: string): boolean {
    return url.endsWith("/refresh");
  }

  /**
   * LOGIN AUTH METHODS
   */

  public login(loginData): Observable<any> {
    const data = {
      username: loginData.email.value,
      password: loginData.password.value,
      grant_type: environment.GRANT_TYPE,
      client_id: environment.CLIENT_ID,
      client_secret: environment.CLIENT_SECRET,
      provider: environment.provider
    };

    return this.http
      .post(this.loginurl, data)
      .pipe(tap((tokens: AccessData) => this.saveAccessData(tokens)));
  }

  /**
   * REGISTER  METHODS
   */

  public register(registerData): Observable<any> {
    const data = {
      first_name: registerData.first_name.value,
      last_name: registerData.last_name.value,
      email: registerData.email.value,
      company_name: registerData.company_name.value,
      password: registerData.password.value
    };
    return this.http.post(this.registerurl, data);
  }

  /**
   * Logout
   */
  public logout() {      
   
    return this.http
      .post(this.logouturl, {}).subscribe(() => {this.tokenStorage.clear();location.reload(true);});
      
  }

  /**
   * Save access data in the storage
   *
   * @private
   * @param {AccessData} data
   */
  private saveAccessData({ access_token, expires_in, refresh_oken, token_type }: AccessData) {
    this.tokenStorage
      .setAccessToken(access_token)
      .setRefreshToken(refresh_oken);
  }
}
