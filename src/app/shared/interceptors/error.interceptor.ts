import { Injectable, Injector } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Subject, Observable, throwError } from "rxjs";
import { map, first, switchMap, catchError } from "rxjs/operators";
import { AuthenticationService } from "../../auth/auth.service";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * Is refresh token is being executed
   */
  private refreshInProgress = false;

  /**
   * Notify all outstanding requests through this subject
   */
  private refreshSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private injector: Injector, public snackbar: MatSnackBar, private AuthenticationService: AuthenticationService) {}

  /**
   * Intercept an outgoing `HttpRequest`
   */
  public intercept(
    req: HttpRequest<any>,
    delegate: HttpHandler
  ): Observable<HttpEvent<any>> {    

    if (this.AuthenticationService.verifyTokenRequest(req.url)) {
      return delegate.handle(req);
    }

    return this.processIntercept(req, delegate);
  }

  /**
   * Process all the requests via custom interceptors.
   */
  private processIntercept(
    original: HttpRequest<any>,
    delegate: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clone: HttpRequest<any> = original.clone();

    return this.request(clone).pipe(
      switchMap((req: HttpRequest<any>) => delegate.handle(req)),
      catchError((res: HttpErrorResponse) => this.responseError(clone, res))
    );
  }

  /**
   * Request interceptor. Delays request if refresh is in progress
   * otherwise adds token to the headers
   */
  private request(req: HttpRequest<any>): Observable<HttpRequest<any>> {
    if (this.refreshInProgress) {
      return this.delayRequest(req);
    }

    return this.addToken(req);
  }

  /**
   * Failed request interceptor, check if it has to be processed with refresh
   */
  private responseError(
    req: HttpRequest<any>,
    res: HttpErrorResponse
  ): Observable<HttpEvent<any>> {    
    const refreshShouldHappen: boolean = this.AuthenticationService.refreshShouldHappen(res);
    console.log(res);
    if (refreshShouldHappen && !this.refreshInProgress) {
     
      if (res.error.error = 'invalid_credentials') {
        this.snackbar.open(res.error.message, "close");
      }else{

        this.refreshInProgress = true;

        this.AuthenticationService.refreshToken().subscribe(
          () => {
            this.refreshInProgress = false;
            this.refreshSubject.next(true);
          },
          () => {
            this.refreshInProgress = false;
            this.refreshSubject.next(false);
          }
        );
      }
    }

    if (refreshShouldHappen && this.refreshInProgress) {
      return this.retryRequest(req, res);
    }

    if (res.status == 404) {
      this.snackbar.open("No resource found please try again later!", "close");
    }    

    

    if (res.status == 500 || res.status == 405) {
      this.snackbar.open("Bad Request try again later!", "close");
    }    

    if (res.status == 0) {
      this.snackbar.open("Unknown error try again later!!", "close");
    }


    return throwError(res);
  }

  /**
   * Add access token to headers or the request
   */
  private addToken(req: HttpRequest<any>): Observable<HttpRequest<any>> {   

    return this.AuthenticationService.getAccessToken().pipe(
      map((token: string) => {
        if (token) {
          let setHeaders: { [name: string]: string | string[] };
          setHeaders = {           
            Authorization: `Bearer ${token}`
          }; 
          console.log(setHeaders);
          return req.clone({ setHeaders });
        }
        return req;
      }),
      first()
    );
  }

  /**
   * Delay request, by subscribing on refresh event, once it finished, process it
   * otherwise throw error
   */
  private delayRequest(req: HttpRequest<any>): Observable<HttpRequest<any>> {
    return this.refreshSubject.pipe(
      first(),
      switchMap(
        (status: boolean) => (status ? this.addToken(req) : throwError(req))
      )
    );
  }

  /**
   * Retry request, by subscribing on refresh event, once it finished, process it
   * otherwise throw error
   */
  private retryRequest(
    req: HttpRequest<any>,
    res: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    const http: HttpClient = this.injector.get<HttpClient>(HttpClient);

    return this.refreshSubject.pipe(
      first(),
      switchMap(
        (status: boolean) =>
          status ? http.request(req) : throwError(res || req)
      )
    );
  }
}
