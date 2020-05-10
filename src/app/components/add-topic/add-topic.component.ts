import {Component, Inject, Injectable, Input, OnInit} from '@angular/core';
import {Post} from 'src/app/models/post';
import {User} from 'src/app/models/user';
import {UserService} from 'src/app/service/user.service';
import {TopicService} from 'src/app/service/topic.service';
import {ActivatedRoute, Params, Router, RoutesRecognized} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {TopicComponent} from '../topic/topic.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.css']
})
// pop up window for adding posts
export class AddTopicComponent implements OnInit {

  errorMessage: string;
  infoMessage: string;
  currentUser: User;

  post: Post;
  description: string;
  name: string;
  isLoading = false;

  number: number;

  constructor(private userService: UserService,
              private topicService: TopicService,
              private router: Router,
              private route: ActivatedRoute,
              public dialogRef: MatDialogRef<TopicComponent>,
              private snackBar: MatSnackBar,
              // passing values in the dialog (if active than in new page doesn't work)
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit() {
    // 1) create object to resolve console error (user will see data in any case), take data from URL
    // this.number = this.route.snapshot.params.postNumber;
    // console.log(this.number);

    this.route.params.subscribe((params: Params) => {
      // The + will convert a string to a number

      // 1 second way) getting params from url
      // this.number = +params['postNumber'];

      // 2) getting data from passing it in the dialog
      if (this.data === null) {
        this.number = 0;
      } else {
        // this.number = +params['postNumber'];
        this.number = this.data.number;
      }
    });

    this.post = new Post(this.number, this.name, this.description, new Date(), this.currentUser.userId);

    if (this.number > 0) {
      this.isLoading = true;
      this.topicService.showPost(this.number)
        .subscribe(
          // get the data for the user
          data => this.post = data
        );
      this.isLoading = false;
    }
  }

  addPost() {
    if (!this.currentUser) {
      this.errorMessage = 'You should sign in to enroll a course';
      return;
    }

    if (this.number > 0) {

      this.topicService.updatePost(this.post, this.data.number).subscribe(
        // for new page update
        // data => {
        //   console.log(data)
        //   //redirect after updating to page
        // this.router.navigate(['topic']);
        // }

        // for dialog update
        data => {
          // this.infoMessage = 'Updated!';
          this.openSnackBar('Updated!');
          this.topicService.updateTopic(data, this.data.number, this.data.indForUpdate);
        }, err => {
          this.errorMessage = 'error';
        }
      );
    } else {
      this.post.userId = this.currentUser.userId;
      this.topicService.addPost(this.post).subscribe(data => {
        this.openSnackBar('Added!');
        // to add and display without refresh the page
        this.topicService.addTopic(data);
          // this.infoMessage = 'Added!';
        }, err => {
          this.errorMessage = 'error';
        }
      );
    }
    this.onClose();
  }


  onClose() {
    this.dialogRef.close();
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
