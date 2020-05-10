import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-remember-password',
  templateUrl: './remember-password.component.html',
  styleUrls: ['./remember-password.component.css']
})
// not REMEMBER BUT reset password (will be sent to user email)
export class RememberPasswordComponent implements OnInit {
  user: User = new User();
  successMessage: string;
  errorMessage: string;
  // email: string;
  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
  }

  resetPassword() {
    this.successMessage = '';
    this.errorMessage = '';
    this.userService.resetPassword(this.user.email).subscribe(data => {
      this.successMessage = 'New password was sent, check your email';
    }, error => {
      this.errorMessage = 'Email not exist!';
    });
  }
}
