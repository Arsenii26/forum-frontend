import {Component, OnInit, Input, NgZone, ElementRef, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import {AngularFireStorage} from '@angular/fire/storage';
import {User} from '../../models/user';
import {UserService} from '../../service/user.service';
import {Observable, Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
// This component will upload image to Firebase storage
export class ImageUploadComponent implements OnInit {
  isLoading = false;
  infoMessage: string;
  errorMessage: string;


  currentUser: User;
  selectedFile: File = null; // file for submission
  subscription: Subscription;

  @ViewChild('myInput')
  myInputVariable: ElementRef;
  private basePath = '/upload';
  url = ''; // url to save to db
  downloadURL: Observable<string>;

  constructor(private http: HttpClient, private afStorage: AngularFireStorage, private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
  }


  // get uploaded file
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  // method will upload image to Firebase storage
  async onUpload() {
    this.isLoading = true;
    const randomId = Math.random().toString(36).substring(2); // random token
    if (this.selectedFile) {
      // const filePath = `${this.basePath}/` + randomId + `_` + `${this.selectedFile.name}`;    // path at which image will be stored in the firebase storage
      const filePath = `${this.basePath}` + randomId + `_` + `${this.selectedFile.name}`;    // store in main folder
      const fileRef = this.afStorage.ref(filePath); // create reference for getting url
      if (this.currentUser.image !== null) {
        this.delete(this.currentUser.image.image); // delete previous image if exist
      }
      // save to firebase storage
      const snap = this.afStorage.upload(filePath, this.selectedFile).then((result) => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.url = url; // get url
          }
          // save url to db
          this.userService.updateImg(this.currentUser.username, this.url).subscribe(
            data => {
              this.openSnackBar('Updated!');
              localStorage.setItem('currentUser', JSON.stringify(data)); // update user cache
            }, err => {
              if (!err || err.status !== 409) {
                this.openSnackBarDefault('Unexpected error: ' + err);
              } else if (err.status === 409) {
                this.openSnackBarDefault('Failed to update image, try another');
              }
            }
          );
      });
        this.isLoading = false;
        this.myInputVariable.nativeElement.value = ''; // reset loaded image (or user can upload second time)
        this.selectedFile = null; // reset loaded image into memory (or user can upload second time)
      });
    } else {alert('Please select an image'); }
  }
  // will delete from firebase storage by url
  delete(downloadUrl) {
    return this.afStorage.storage.refFromURL(downloadUrl).delete();
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
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
