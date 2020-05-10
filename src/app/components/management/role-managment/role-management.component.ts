import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../models/user';
import {Role} from '../../../models/role';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ManagComponent} from '../../manag/manag.component';

@Component({
  selector: 'app-role-managment',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
// pop up window for assign/remove user roles
export class RoleManagementComponent implements OnInit {
  currentUser: User;
  userRoles: Array<Role>;
  notUserRoles: Array<Role>;
  username: string;
  roleId: number;
  constructor(private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<ManagComponent>,
  ) {
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit(): void {
    this.username = this.data.usernamePassed;
    // assign json response to local arrays
    this.userRoles = this.data.userRoles;
    this.notUserRoles = this.data.notUserRoles;
  }

  saveRole() {
    this.userService.assignUserRole(this.username, this.roleId).subscribe();
    this.openSnackBarGreen('Role was assigned!');
    this.onClose();
  }

  deleteRole() {
    if (parseInt(String(this.roleId), 10) === 1) { // get value of role id
      this.openSnackBarDefault('Can\'t remove user role');
    } else {
      // delete is working but you can disable user account (on the user side BUT NOT DB) you need refresh to refill user-front list
      this.userService.deleteUserRole(this.username, this.roleId).subscribe();
      this.openSnackBarGreen('Role was deleted!');
      this.onClose();
    }
  }

  openSnackBarGreen(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
    });
  }
  openSnackBarDefault(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
    });
  }

  // will close pop-up dialog
  onClose() {
    this.dialogRef.close();
  }
}
