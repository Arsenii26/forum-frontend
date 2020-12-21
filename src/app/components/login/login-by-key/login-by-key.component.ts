import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/user';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-by-key',
  templateUrl: './login-by-key.component.html',
  styleUrls: ['./login-by-key.component.css']
})
export class LoginByKeyComponent implements OnInit {

  // user: User = new User();
  key: string;
  successMessage: string;
  errorMessage: string;
  isLoading = false;

  // email: string;
  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.userService.currentUserValue) {
      this.router.navigate(['/user-account']);
      return;
    }
  }

  loginByKey() {
    // subscribe cuz it's observable
    this.isLoading = true; // start loading spinner
    this.userService.loginByKey(this.key).subscribe(data => {
      console.log('loginByKey ' + data);
      this.isLoading = false; // stop loading spinner
      window.location.reload();
      // this.router.navigate(['/user-account']);
    }, err => {
      this.isLoading = false;
      this.errorMessage = 'Key not exists';
    });
  }

  // loginByKey() {
  //   this.successMessage = '';
  //   this.errorMessage = '';
  //   // this.userService.resetPassword(this.user.email).subscribe(data => {
  //   //   this.successMessage = 'New password was sent, check your email';
  //   // }, error => {
  //   //   this.errorMessage = 'Email not exist!';
  //   // });
  //
  //   this.userService.loginByKey(this.user.email).subscribe(data => {
  //     this.successMessage = 'New password was sent, check your email';
  //   }, error => {
  //     this.errorMessage = 'Email not exist!';
  //   });
  // }
}
