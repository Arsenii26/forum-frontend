import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';
import { PasswordRenewDto } from 'src/app/dto/passwordRenewDto';
import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit, OnDestroy {

  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  // user : User;
  currentUser: User;
  passwordRenewDto: PasswordRenewDto;


  oldPassword: string ;
  password: string;
  confirmPassword: string ;

  // value for one way binding to confirm that user really wants delete account
  passwordForDelete: string;

  infoMessage: string;
  errorMessage: string;


  subscription: Subscription;

	constructor(private userService: UserService, private router: Router,  private route: ActivatedRoute) {

	}

  ngOnInit() {
    // this.findAllUsers();
    this.passwordRenewDto = new PasswordRenewDto(this.oldPassword, this.password, this.confirmPassword);

    this.subscription = this.userService.currentUser.subscribe(data => {
      this.currentUser = data;
      // localStorage.setItem('currentUser', JSON.stringify(response));
    });
  }

  changeUserDetails() {
    this.infoMessage = '';
    this.errorMessage = '';
    this.userService.changeUserDetails(this.currentUser, this.currentUser.username).subscribe(
      data => {
        this.infoMessage = 'Updated!';
      }, err => {
        this.errorMessage = 'error';
      }
    );
  }

  changeUserPassword() {
    this.infoMessage = '';
    this.errorMessage = '';
    this.userService.changeUserPassword(this.passwordRenewDto, this.currentUser.username).subscribe(
      data => {
        this.infoMessage = 'Updated!';
      }, err => {
        if (!err || err.status !== 409) {
          this.errorMessage = 'Unexpected error: ' + err;
        } else if (err.status === 409) {
          // console.log(err);
          this.errorMessage = 'Previous user password not matches with entered!';
        }
      }
    );
  }

  deleteUserAccount() {
    this.userService.deleteUserAccount(this.currentUser.username, this.passwordForDelete).subscribe(
      data => {
        this.infoMessage = 'Deleted'; // alert here should be
        // here should be confirmation for delete
        this.userService.logOut().subscribe(); // logout user from localstorage
        this.router.navigate(['login']); // redirect to avoid possible errors
      }, err => {
        if (!err || err.status !== 409) {
          this.errorMessage = 'Unexpected error: ' + err;
        } else if (err.status === 409) {
          this.errorMessage = 'Wrong password! Account can\'t be deleted';
        }
      }
    );
  }
  // set base64 image to the db
  updateImage() {
	  // this.userService.updateImg(this.currentUser.username, this.croppedImage).subscribe(
    //   data => {
    //     console.log(data.image['image']);
    //     this.infoMessage = 'Updated!';
    //   }, err => {
    //     if (!err || err.status !== 409) {
    //       this.errorMessage = 'Unexpected error: ' + err;
    //     } else if (err.status === 409) {
    //       // console.log(err);
    //       this.errorMessage = 'Failed to update image, try another';
    //     }
    //   }
    // );
  }

  // 3 methods for base 64 String image
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  cropIt(evnt) {
    console.log(this.croppedImage);
  }

  // reset error
  onHandleError() {
    // this.error = null;
    this.errorMessage = null;
  }

  ngOnDestroy(): void {
this.subscription.unsubscribe();
  }

}
