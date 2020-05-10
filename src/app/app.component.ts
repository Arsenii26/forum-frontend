import {Component, Input, Output} from '@angular/core';
import { User } from './models/user';

import { Router } from '@angular/router';
import { UserService } from './service/user.service';
import {Role} from './models/role';
import {ColorService} from './service/color.service';
import {ThemeService} from './theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;
  @Output() userAdmin: boolean;
  roles: Array<Role>;

  constructor(private userService: UserService,
              private router: Router,
              private colorService: ColorService,
              private themeService: ThemeService
              ) {
    this.colorService.load();
    // method will check that user is logged in and user roles for activating the guards
    this.userService.autoLogin();
    // Call it observable because it can be changed from other pages as login
    this.userService.currentUser.subscribe(data => {
      // console.log(data); // debug
      this.currentUser = data;

      if (this.currentUser !== null) {


      // https://www.concretepage.com/questions/578
      this.roles = data['authorities'];
      // trying to find user with admin role in 'authority' JSON response
      const kk = this.roles.find(ob => ob['authority'] === 'ROLE_ADMIN');

      // checking admin roles to hide some url visibility if user not admin
      // if (this.roles.length > 1) {
      if (kk !== null && kk !== undefined) {
        this.userAdmin = true;
      } else {
        this.userAdmin = false;
      }
    }
      }
      );
  }

  logOut() {
    this.userService.logOut().subscribe(data => {
      this.router.navigate(['/login']);
    });
  }

  toggle() {
    const active = this.themeService.getActiveTheme() ;
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }
}
