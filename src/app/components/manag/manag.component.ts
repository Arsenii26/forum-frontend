import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../../models/user';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Post} from '../../models/post';
import {Role} from '../../models/role';
import {AddPostDetailsComponent} from '../add-post-details/add-post-details.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RoleManagementComponent} from '../management/role-managment/role-management.component';
import {TopicComponent} from '../topic/topic.component';
import {PagerService} from '../../service/pager.service';



@Component({
  selector: 'app-manag',
  templateUrl: './manag.component.html',
  styleUrls: ['./manag.component.css']
})
export class ManagComponent implements OnInit, OnDestroy {

  userList: Array<User>;
  subscription: Subscription;
  currentUser: User;
  isLoading = false;
  roles: Array<Role>;
  totalUsers: number;

  public page = 0;
  public size = 10;
  public username: string;
  public pages: Array<number>;
  lastPage: number;
  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              public pager: PagerService,
              ) { }
              // ) { }

  ngOnInit() {
    this.isLoading = true;
    this.subscription = this.userService.currentUser.subscribe(data => {
      this.currentUser = data;
      this.isLoading = false;
      // localStorage.setItem('currentUser', JSON.stringify(response));
    });
    this.findAllUsers();
    this.getAllUsers();
  }

  // findAllUsers() {
  //   this.userService.findAllUsers().subscribe(data => {
  //     console.log(data);
  //     this.userList = data;
  //   });
  // }
  findAllUsers() {
    this.userService.findAllUsers(this.page, this.size).subscribe(data => {
      // console.log(data); // all users
      // setup last page
      this.lastPage = data.totalPages - 1;
      // console.log('page ' + this.page); // current page
      // console.log(data.totalPages); // total pages
      // (this.page + 1) because my index in array of pages started with 0
      this.pagesLimit(data.totalPages, data.totalElements, this.page + 1);
      this.userService.setUsers(data.content);
      // this.userList = (data['content']);
      // this.pages = new Array(data.totalPages);
      this.totalUsers = data.totalElements;
    });
  }

  // method for creating array of numbers (number of pages) with limits (up to 5)
  pagesLimit(totalPages: number, totalItems: number, currentPage: number = 1) {
    let startPage: number;
    let endPage: number;
    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    // create an array of pages to ng-repeat in the pager control
    this.pages = this.pager.each(startPage - 1, endPage);
  }
  // pagesLimit(totalPages: number, totalItems: number, currentPage: number = 0, pageSize: number = 10) {
  //   let startPage: number;
  //   let endPage: number;
  //   console.log(totalPages);
  //   console.log(currentPage);
  //   if (totalPages <= 5) {
  //     startPage = 1;
  //     endPage = totalPages;
  //   } else {
  //     if (currentPage <= 3) {
  //       startPage = 1;
  //       endPage = 5;
  //     } else if (currentPage + 1 >= totalPages) {
  //       startPage = totalPages - 4;
  //       endPage = totalPages;
  //     } else {
  //       startPage = currentPage - 2;
  //       endPage = currentPage + 2;
  //     }
  //   }
  //   console.log(startPage);
  //   console.log(endPage);
  //   // calculate start and end item indexes
  //   let startIndex = (currentPage - 1) * pageSize;
  //   console.log('start index ' + startIndex);
  //   let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
  //   console.log('end index ' + endIndex);
  //   // create an array of pages to ng-repeat in the pager control
  //   let list = [];
  //   for (let i = startPage; i <= endPage; i++) {
  //     list.push(i);
  //   }
  //   // this.pages = Array.from(Array(endPage), (e, i) => i + 1);
  //   this.pages = this.pager.each(startPage, endPage + 1);
  //   // this.pages = list;
  //   console.log(this.pages);
  //   console.log(Array.from(Array(endIndex), (e, i) => i + 1));
  // }
  getAllUsers() {
    this.subscription = this.userService.userChanged
      .subscribe(
        (user: User[]) => {
          this.userList = user;
        }
      );
  }
  //  range(start, end) {
  //    var list = [];
  //    for (var i = lowEnd; i <= highEnd; i++) {
  //      list.push(i);
  //    }
  // }
  onFindUserByUsername(userName: string) {
      this.userService.findUserByUsername(userName).subscribe(data => {
        // console.log(data); // get found user value
        if (data !== null) {
        this.userService.setUsers(new Array(data));
        this.pages = new Array(data.totalPages);
        } else {
          this.openSnackBarDefault('User not found!');
        }
      });
  }
  onFindApproxUserByUsername(userName: string) {
    // size is 100 just number for not overloading the db (assume it will be one page)
    this.userService.findUserApproxByUsername(userName, this.page, 100).subscribe(data => {
      if (data !== null) {
        this.userService.setUsers(data.content);
        this.pages = new Array(data.totalPages);
      } else {
        this.openSnackBarDefault('User not found!');
      }
    });
  }

  setPage(i: number, event: any) {
    event.preventDefault();
    this.page = i;
    this.findAllUsers();
  }

  setMaxNumber(maxSize: number, event: any) {
    event.preventDefault();
    this.page = 0;
    this.size = maxSize;
    this.findAllUsers();
  }

  // enableUser(username: string) {
  enableUser(username: string, user: User, index: number) {
    this.userService.enableUser(username).subscribe();
    // console.log(user); // new user value
    user.enabled = true;
    this.openSnackBarGreen('User ' + username + ' was enabled!');
    this.userService.updateUser(user, index);
    // location.reload();
  }

  // disableUser(username: string) {
  disableUser(username: string, user: User, index: number) {
    this.userService.disableUser(username).subscribe();
    // taking authorities from the response
    this.roles = user['authorities'];
    // trying to find user with admin role in 'authority' JSON response (and after give permit to disable if user not admin)
    const kk = this.roles.find(ob => ob['authority'] === 'ROLE_ADMIN');
    if (kk === undefined) {
      user.enabled = false;
      this.openSnackBarGreen('User ' + username + ' was disabled!');
      this.userService.updateUser(user, index);
    } else {
      this.openSnackBarDefault('Admin cant be disabled!');
    }
    // location.reload();
  }

  findAllUserRoles(username: string) {
    this.userService.displayUserRoles(username).subscribe(data => {
      // console.log(data); // get all user roles
      this.dialog.open(RoleManagementComponent, {
          autoFocus: true,
          width : '50%',
          height: '56%',
          data: {
            usernamePassed: username,
            userRoles: data.userRoles,
            notUserRoles: data.notUserRoles
          }
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

}
