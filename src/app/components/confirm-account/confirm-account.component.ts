import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
// components runs after user confirmed through email the account
export class ConfirmAccountComponent implements OnInit, OnDestroy {
  userId: string;
  token: string;
  errorMessage: string;
  infoMessage: string;
  private subscription: Subscription ;

  constructor(
              private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private snackBar: MatSnackBar,
              private location: Location) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    // if (this.token !== null) {
    this.confirm();
    // }
  }

  // redirect user to the login page
  confirm() {
    this.errorMessage = '';
    this.userService.confirmUser(this.token).subscribe(
      data => {
        // DON'T HAVE DATA IN THIS ACTION
        this.infoMessage = 'Successful! \nNow you can login';
        this.openSnackBar(this.infoMessage);
        this.location.replaceState('/'); // clears browser history so they can't navigate with back button
        this.router.navigate(['/login']);
      }, err => { // different error states with the one error code
        if (!err || err.status !== 409) {
          this.errorMessage = 'Unexpected error: ' + err;
          this.openSnackBarDefault(this.errorMessage);
          this.location.replaceState('/'); // clears browser history so they can't navigate with back button
          this.router.navigate(['/login']);
        } else if (err.status === 409 && err['error'] === 'Invalid token') {
          // console.log(err);
          this.errorMessage = 'Invalid token!';
          this.openSnackBarDefault(this.errorMessage);
          this.location.replaceState('/'); // clears browser history so they can't navigate with back button
          this.router.navigate(['/login']);
        } else if (err.status === 409 && err['error'] === 'Token been expired') {
          // console.log(err);
          this.errorMessage = 'Token been expired!';
          this.openSnackBarDefault(this.errorMessage);
          this.location.replaceState('/'); // clears browser history so they can't navigate with back button
          this.router.navigate(['/login']);
        }
      }
    );
  }
  openSnackBarDefault(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
    });
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
