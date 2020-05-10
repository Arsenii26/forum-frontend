import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {UserService} from '../service/user.service';

/**
 * Guard will check that user is authorized and than will get access to secure pages
 */
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService,
              private router: Router) {
  }
  // PROTECT ROUTE
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean| UrlTree> | boolean | UrlTree {
    // return boolean observable
    // console.log(this.userService.currentUserSubject); // debug (get user)
    return this.userService.currentUserSubject.pipe(
    // take(1) to make sure that we always take latest user value
      take(1),
      map(currentUserSubject => {
       const isAuth = !!currentUserSubject;
       if (isAuth) {
         return true;
       }
       return this.router.createUrlTree(['auth']);
     })
    );
    //   tap(isAuth => {
    //    if (!isAuth) {
    //      this.router.navigate(['/auth']);
    //    }
    // }));
  }
}
