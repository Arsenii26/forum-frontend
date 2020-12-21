import {Component, OnDestroy, OnInit} from '@angular/core';
import { TopicService } from 'src/app/service/topic.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { Post } from 'src/app/models/post';
import {PostDetails} from '../../models/postDetails';
import {UserService} from '../../service/user.service';
import {User} from '../../models/user';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddPostDetailsComponent} from '../add-post-details/add-post-details.component';
import {UserAndPostDetailsDto} from '../../dto/UserAndPostDetailsDto';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-topic-post',
  templateUrl: './topic-post.component.html',
  styleUrls: ['./topic-post.component.css']
})
// will open post details page for ONE CHOSEN topic
export class TopicPostComponent implements OnInit, OnDestroy {

  isLoading = false;
  postNumber: number;
  postDetailsNumber: number;
  currentPost: Post;
  detailsList: Array<PostDetails>;
  usersList: Array<User>;
  errorMessage: string;
  loadingError: string;
  currentUser: User;
  postDetailsWithUsers: Array<UserAndPostDetailsDto>; // dto
  userPost = false;

  subscription: Subscription;

  constructor(private userService: UserService,
              private topicService: TopicService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
  ) {
    this.currentPost = JSON.parse(localStorage.getItem('currentPostDetails'));
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit() {
    this.postNumber = this.route.snapshot.params.postNumber;
    this.setAllPostsDetails();
    this.getAllPostDetails();
  }
  getAllPostDetails() {
    this.subscription = this.topicService.postDetailsChanged
      .subscribe(
        (postDetails: PostDetails[]) => {
          this.detailsList = postDetails;
        }
      );
    // this.detailsList = this.topicService.getPostDetailsBrowser();
  }

  showPost() {
    this.topicService.showPost(this.postNumber).subscribe(data => {
      this.detailsList = data;
    });
  }

  showPostDetails() {
    localStorage.setItem('postDetailsNumber', JSON.stringify(this.postDetailsNumber));
    // console.log('in show mode!');

    this.postNumber = parseInt(localStorage.getItem('currentPostDetails'));
    this.router.navigate(['topic-details/add/', this.postNumber]);
    // this.router.navigate(['/add-post-details', this.postNumber]);
  }

  // using two arrays
  setAllPostsDetails() {
    this.isLoading = true;

    this.postNumber = parseInt(localStorage.getItem('currentPostDetails'));
    this.topicService.findAllPostsDetails(this.postNumber).subscribe(data => {
      // this.detailsList = JSON.parse(data.users);
      // this.detailsList = data.postDetails;
      // USER LIST CHANGED
      // this.usersList = data.users;
      // console.log(data); // debug: get all posts details for the chosen post
      this.topicService.setPostDetailsBrowser(data.postDetails);
      this.topicService.setUserList(data.users);
      this.usersList = this.topicService.getUserList();
      this.isLoading = false;
    },
      (error) => {
        console.log('Some error! ' + error);
        // this.snackbar.open('this went wrong' + error);
        // this.router.navigate(['/error']);
        this.loadingError = 'Server turned off';
        this.isLoading = false;
      });
    if (this.currentUser !== null && this.currentUser.userId !== null) {
      this.userPost = true;
    }
  }

  // using DTO (doesn't work right now in looping the arrays)
  // findAllPostsDetails() {
  //   this.postNumber = parseInt(localStorage.getItem('currentPostDetails'));
  //
  //   this.topicService.findAllPostsDetails(this.postNumber).subscribe(data => {
  //     // console.log(data);
  //     // this.detailsList = JSON.parse(data.users);
  //     this.postDetailsWithUsers = data;
  //     console.log(this.postDetailsWithUsers);
  //   });
  //   // console.log(this.detailsList);
  //   // console.log(this.usersList);
  // }

  updatePostDetails(postDetailsNumber, userId) {
    if (this.currentUser.userId === userId) {
      // Update => values will be pre-populated on this page
      this.router.navigate(['topic-details/update/', this.postNumber, 'update', postDetailsNumber ]); // NOW
    }  else {
      this.errorMessage = 'User isnt author of this post!';
    }
  }


  deletePostDetails(postDetailsNumber, userId, ind) {
    if (this.currentUser.userId === userId) {
      this.topicService.deletePostDetails(this.postNumber, postDetailsNumber).subscribe(
        response => {
          // this.infoMessage = `Delete of post ${postDetailsNumber} success!`;
          this.topicService.deletePostDetailsBrowser(ind);
          this.openSnackBar(`Delete of post ${postDetailsNumber} success!`);
          // this.findAllPostsDetails();
        }
      );
    }  else {
      this.errorMessage = 'User id not equals!';
    }
  }

  // reset error
  onHandleError() {
    this.errorMessage = null;
  }

  // HERE create add in the dialog box
  onCreate() {
    // this.addTopicComponent.addPost();
    // this.postNumber = parseInt(localStorage.getItem('currentPostDetails'));

    localStorage.setItem('postDetailsNumber', JSON.stringify(this.postDetailsNumber));
    // console.log('in show mode!'); // debug

    this.postNumber = parseInt(localStorage.getItem('currentPostDetails'));
    this.dialog.open(AddPostDetailsComponent, {
        autoFocus: true,
        width : '50%',
        height: '56%',
        data: {
          postNumber: this.postNumber,
          usersList: this.usersList
        }
      }
    );
  }

  // update add in the dialog box
  onEditDetails(number, userId, ind) {
    if (this.currentUser.userId === userId) {
      this.topicService.showPostDetail(this.postNumber, number); // will get data from backend
      this.dialog.open(AddPostDetailsComponent, {
          autoFocus: true,
          width : '50%',
          height: '56%',
          data: {
            number,
            postNumber: this.postNumber,
            postDetailIndex: ind
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
