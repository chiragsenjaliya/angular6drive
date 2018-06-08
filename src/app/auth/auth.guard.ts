import { Injectable, Inject } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './auth.service';

/**
 * Guard, checks access token availability and allows or disallows access to page,
 * and redirects out
 *
 * usage: { path: 'test', component: TestComponent, canActivate: [ AuthGuard ] }
 *
 * @export
 */
@Injectable()
export class ProtectedGuard implements CanActivate, CanActivateChild {
  private publicFallbackPageUri: string = '/login';
  constructor(
    @Inject(AuthenticationService) private authService: AuthenticationService ,
    private router: Router 
  ) {}

  /**
   * CanActivate handler
   */
  public canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthorized().pipe(
      map((isAuthorized: boolean) => {       
        if (!isAuthorized && !this.isPublicPage(state)) {
          this.navigate(this.publicFallbackPageUri);

          return false;
        }

        return true;
      })
    );
  }

  /**
   * CanActivateChild handler
   */
  public canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }

  /**
   * Check, if current page is public fallback page
   */
  private isPublicPage(state: RouterStateSnapshot): boolean {
    return state.url === this.publicFallbackPageUri;
  }

  /**
   * Navigate away from the app / path
   */
  private navigate(url: string): void {
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      this.router.navigateByUrl(url);
    }
  }
}