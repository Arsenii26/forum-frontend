import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {UserService} from '../service/user.service';

/**
 * Guard will check that user has role admin
 */
@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService,
              private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return boolean observable
    if (this.userService.userAdmin === undefined) {
      this.router.navigate(['']);
    }
    return this.userService.userAdmin.pipe(
      // take(1) to make sure that we always take latest user value
      take(1),
      map(userAdmin => {
        const isAdmin = !!userAdmin;
        if (isAdmin) {
          return true;
        }
        return this.router.createUrlTree(['auth']);
      })
    );
  }
}
