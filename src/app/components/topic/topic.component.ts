import {Component, OnInit, ViewChild, Inject, Injectable, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { TopicService } from 'src/app/service/topic.service';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {AlertComponent} from '../alert/alert.component';
import {AddTopicComponent} from '../add-topic/add-topic.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import {ManagComponent} from '../manag/manag.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject, Subscription} from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
@Injectable({providedIn: 'root'})
export class TopicComponent implements OnInit, OnDestroy   {

  postList: Array<Post>;
  errorMessage: string;
  infoMessage: string;
  currentUser: User;

  post: Post;
  number: number;
  name: string;

  isLoading = false;
  userPost = false;

  selectedValue = 'default';
  sortingValue = 'postNumber';
  sortingOrder = 'Asc';

  subscription: Subscription;

  currentPage: number;
  totalPages: number;
  constructor(private userService: UserService,
              private topicService: TopicService,
              private router: Router,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
  ) {
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit() {
    // was
    // this.setPostsAsc('postNumber');
    // became
    this.setPosts('Asc', 'postNumber');
    // get local version of array on the client side
    this.getAllPosts();
  }

  // way with ul (all in one line)
  sorting(value: string, event: any) {
    switch (value) {
      case 'default':
        event.preventDefault();
        this.selectedValue = 'default';
        this.sortingOrder = 'Asc';
        // for load next page method together with load more
        this.sortingValue = 'postNumber';
        // sort form 1 to 10000++++
        this.setPosts(this.sortingOrder, this.sortingValue);
        break;
      case 'newToOld':
        event.preventDefault();
        this.selectedValue = 'newToOld';
        this.sortingOrder = 'Desc';
        this.sortingValue = 'dateCreated';
        // sort form today to many years ago
        this.setPosts(this.sortingOrder, this.sortingValue);
        break;
      case 'oldToNew':
        event.preventDefault();
        this.selectedValue = 'oldToNew';
        this.sortingOrder = 'Asc';
        this.sortingValue = 'dateCreated';
        // sort form many years ago to today
        this.setPosts(this.sortingOrder, this.sortingValue);
        break;
    }
  }

  setAllPosts() { // will be ALL
    this.isLoading = true;
    this.subscription =  this.topicService.findAllPosts().subscribe(data => {
      // this.postList = data;
      this.topicService.setTopics(data);
      // this.postList = this.topicService.getTopics();
      this.isLoading = false;
    });
    if (this.currentUser !== null && this.currentUser.userId !== null) {
      this.userPost = true;
    }
  }
  // only one method! flexible
  setPosts(sortOrder: string, sortBy: string) { // will be ALL with pagination
    this.isLoading = true;
    this.subscription =  this.topicService.findAllPostsOrdered(sortOrder, sortBy).subscribe(data => {
      this.currentPage = data.pageable.pageNumber;
      this.totalPages = data.totalPages;
      // console.log('Current page' + this.currentPage); // debug
      this.topicService.setTopics(data['content']);
      this.isLoading = false;
    });
    if (this.currentUser !== null && this.currentUser.userId !== null) {
      this.userPost = true;
    }
  }

  // load 5 more(depends on backend default value) items and saving state
  loadMorePosts(page: number) {
    this.isLoading = true;
    this.subscription =  this.topicService.loadNextPage(this.sortingOrder, page, this.sortingValue).subscribe(data => {
      // console.log(data); // debug
      // setting next page to the array with loaded pages content
      this.topicService.setMoreTopics(data['content']);
      this.isLoading = false;
    });
    if (this.currentUser !== null && this.currentUser.userId !== null) {
      this.userPost = true;
    }
  }

  // increase number of page by 1 (choosing 'next' page)
  setNextPage() {
    if ((this.totalPages - 1) > this.currentPage) {
    // console.log(this.currentPage); // debug
    this.currentPage = this.currentPage + 1; // increase number of the page
    // console.log(this.currentPage); // debug (will be +1)
    this.loadMorePosts(this.currentPage);
    }
  }
  getAllPosts() {
    this.subscription = this.topicService.postChanged
      .subscribe(
        (post: Post[]) => {
          this.postList = post;
        }
      );
  }

  // Will open new page
  // getPostDetails(postDetails: PostDetails){
  //   localStorage.setItem("currentPostDetails", JSON.stringify(postDetails));
  //   console.log(postDetails.number);
  //   this.router.navigate(['/topic-post', postDetails.number]);
  // }

  // pre populate post
  getPostDetails(number: number) {
    localStorage.setItem('currentPostDetails', JSON.stringify(number));
    // console.log(number); // get passed value (post number)
    // 1222
    // this.router.navigate(['/topic-post', number]);
    this.router.navigate(['/topic', number]);
  }
  // for the new page (not dialog box)
  addPost(post: Post) {
    this.topicService.addPost(post).subscribe(data => {
        this.infoMessage = 'OK';
      }, err => {
        this.errorMessage = 'error';
      }
    );
  }
  // for the new page (not dialog box)
  updatePost(postNumber, userId) {
    if (this.currentUser.userId === userId) {
      this.router.navigate(['topic/add', postNumber]);
      // this.router.navigate(['/topic/topic-add', postNumber]);
    } else {
      this.errorMessage = 'User id not equals!';
    }
  }


  deletePost(postNumber, userId, ind) {
    if (this.currentUser.userId === userId) {
      this.topicService.deletePost(postNumber).subscribe(
        response => {
          // this.infoMessage = `Delete of post ${postNumber}!`;
          this.topicService.deleteTopic(ind);
          this.openSnackBar(`Delete of post ${postNumber}!`);
          // this.postChanged.next(this.postList.slice());
          // this.findAllPosts();
        }
      );
    } else {
      this.errorMessage = 'User id not equals!';
    }
  }

  onHandleError() {
    this.errorMessage = null;
  }
  // dialog box add
// https://stackoverflow.com/questions/15847726/is-there-a-simple-way-to-use-button-to-navigate-page-as-a-link-does-in-angularjs
  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '56%';
    this.dialog.open(AddTopicComponent, dialogConfig
    );
  }
// dialog box update
  onEdit(postNumber, userId, index) {
    // console.log(index); // index of the post in the local array
    if (this.currentUser.userId === userId) {
      // const dialogConfig = new MatDialogConfig();
      // dialogConfig.autoFocus = true;
      // dialogConfig.width = '50%';
      // dialogConfig.height = '56%';
      // dialogConfig.data = postNumber;
      this.dialog.open(AddTopicComponent, {
          autoFocus: true,
          width : '50%',
          height: '56%',
          data: {
            number: postNumber,
            indForUpdate: index
          }
        }
      );
    } else {
      this.errorMessage = 'User id not equals!';
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

/**
 * This class for the testing purposes (will open second HTML into pop up window)
 */
@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
