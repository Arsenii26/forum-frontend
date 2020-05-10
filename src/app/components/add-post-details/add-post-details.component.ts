import {Component, Inject, Input, OnInit} from '@angular/core';
import {UserService} from 'src/app/service/user.service';
import {TopicService} from 'src/app/service/topic.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from 'src/app/models/user';
import {PostDetails} from 'src/app/models/postDetails';
import {Post} from 'src/app/models/post';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TopicComponent} from '../topic/topic.component';
import {TopicPostComponent} from '../topic-post/topic-post.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-post-details',
  templateUrl: './add-post-details.component.html',
  styleUrls: ['./add-post-details.component.css']
})
// pop up window for adding post details
export class AddPostDetailsComponent implements OnInit {

  // postList: Array<Post>;
  errorMessage: string;
  infoMessage: string;
  currentUser: User;


  postDetails: PostDetails;
  @Input() number: number;
  name: string;
  details: string;
  @Input() postNumber: number;
  userId: number;


  constructor(private userService: UserService,
              private topicService: TopicService,
              private router: Router,
              private route: ActivatedRoute,
              // using dialog, not separate page
              public dialogRef: MatDialogRef<TopicPostComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackBar: MatSnackBar,
  ) {
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit() {
    // console.log(this.postNumber); // debug
    // console.log(this.number); // debug


    // HERE: using dialog, not separate page
    this.route.params.subscribe((params: Params) => {
      if (this.data.number === undefined) {
        // add mode
        this.number = 0;
        this.postNumber = this.data.postNumber;
      } else {
        // update mode
        this.number = this.data.number;
        this.postNumber = this.data.postNumber;
      }
    });


    this.postDetails = new PostDetails(this.number, this.name, this.details, new Date(), this.postNumber, this.userId);
    if (this.number > 0) {
      this.topicService.showPostDetail(this.postNumber, this.number)
        .subscribe(
          // get the data for the user
          data => this.postDetails = data
        );
    }
  }


  addPostDetails() {
    if (!this.currentUser) {
      this.errorMessage = 'You should sign in to add post details';
      return;
    }
    if (this.data.postNumber && this.data.number > 0) {
      // update mode
      this.topicService.updatePostDetails(this.postDetails, this.data.postNumber, this.data.number).subscribe(
        data => {
          this.topicService.updatePostDetailsBrowser(data, this.data.postNumber, this.data.postDetailIndex);
          // this.infoMessage = 'Updated!';
          this.openSnackBar('Updated!');
        }, err => {
          this.errorMessage = 'error';
        }
      );
    } else {
      // add mode
      this.postDetails.userId = this.currentUser.userId;
      this.topicService.addPostDetails(this.postDetails, this.postNumber).subscribe(data => {
          // console.log(data); // debug: will display added values to new post details
          this.topicService.addPostDetailsBrowser(data);
          // this.infoMessage = 'Added!';
          this.openSnackBar('Added!');
        }, err => {
          this.errorMessage = 'error';
        }
      );
      // temp variable for checking that user has first post in this topic or not (for without reload page update)
      let temp = false;
      for (let i = 0; i < this.data.usersList.length; i++) {
        // if user created the first post, than this if will be TRUE
        if (this.data.usersList[i].userId === this.currentUser.userId) {
          temp = true;
          break;
        }
        // will continue loop and will not allow to execute rest until if statement will return FALSE result
        continue;
      }
      // if temp === false ==> user didn't create first post in this topic
      if (temp === false) {
        this.data.usersList.push(this.currentUser);
      }
    }
    // HERE: using dialog, not separate page (auto close the dialog after add/update)
    this.onClose();
  }
  onClose() {
    this.dialogRef.close();
    // location.reload();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }
}
