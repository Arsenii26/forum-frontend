import {Component, OnInit, Output} from '@angular/core';

import {User} from '../../models/user';
import {Router} from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import {Role} from '../../models/role';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
user: User = new User();
errorMessage: string;
isLoading = false;
// create instance + router(to navigate page)
constructor(private userService: UserService, private router: Router) { }

  // if user exists then redirect to profile page
ngOnInit() {
  if (this.userService.currentUserValue) {
    this.router.navigate(['/topic']);
    return;
  }
}

login() {
   // subscribe cuz it's observable
  this.isLoading = true; // start loading spinner
  // confirmPassword ALWAYS WILL BE "" because it's only on front-end side!
  // console.log(this.user); // debug
  this.userService.login(this.user).subscribe(data => {
    // console.log('login: ' + data); // debug
    this.isLoading = false; // stop loading spinner
    this.router.navigate(['/user-account']);
    // location.reload();
  }, err => {
    // always 401 if wrong credentials
    // if (!err || err.status !== 409) {
    //   this.isLoading = false;
    //   this.errorMessage = 'Unexpected error: ' + err;
    // } else if (err.status === 409 && err['error'] === 'Account not activated') { // 'error' get from json response
    //   this.isLoading = false;
    //   this.errorMessage = 'Account isn\'t activated.\n Please check your email.';
    // } else if (err.status === 409 && err['error'] === 'Wrong credentials') {
    //   this.isLoading = false;
    //   this.errorMessage = 'Username or password is incorrect';
    // }


    // temp solution
    this.isLoading = false;
    // Or your account was disabled
    this.errorMessage = 'Username or password is incorrect.\nOr your account wasn\'t activated';
  });
}

}


