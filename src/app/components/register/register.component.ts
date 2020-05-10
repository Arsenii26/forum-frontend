import {Component, Input, OnInit} from '@angular/core';
import { User } from 'src/app/models/user';

import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  errorMessage: string;
  infoMessage: string;

  isLoading = false;
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar, private location: Location) {
  }

  ngOnInit() {
    if (this.userService.currentUserValue) {
      this.router.navigate(['topic']);
      return;
    }
  }

  register() {
    this.errorMessage = '';
    this.isLoading = true;
    this.userService.register(this.user).subscribe(data => {
      // console.log(data);
        // this.infoMessage = 'Successful! \nNow you can login';
        this.infoMessage = 'Successful! \nEmail been sent to your email to confirm!';
        this.openSnackBar(this.infoMessage);
        this.isLoading = false;
        this.location.replaceState('/'); // clears browser history so they can't navigate with back button
        this.router.navigate(['/login']);
      }, err => {
        console.log(err); // debug
        if (!err || err.status !== 409) {
          this.isLoading = false;
          this.errorMessage = 'Unexpected error: ' + err;
        } else if (err.status === 409 && err['error'] === 'username exists') {
          this.isLoading = false;
          this.errorMessage = 'Username is already exist';
        } else if (err.status === 409 && err['error'] === 'email exists') {
          this.isLoading = false;
          this.errorMessage = 'Email is already exist';
        }
      }
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }


}
