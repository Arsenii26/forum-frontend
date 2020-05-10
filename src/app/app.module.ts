import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import {
  DialogOverviewExampleDialogComponent,
  TopicComponent
} from './components/topic/topic.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TopicPostComponent } from './components/topic-post/topic-post.component';
import { AddTopicComponent } from './components/add-topic/add-topic.component';
import { AddPostDetailsComponent } from './components/add-post-details/add-post-details.component';
import { ManagComponent } from './components/manag/manag.component';
import { AlertComponent } from './components/alert/alert.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {PlaceholderDirective} from './shared/placeholder/placeholder.directive';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import {MatSelectModule} from '@angular/material/select';
import { RoleManagementComponent } from './components/management/role-managment/role-management.component';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';
import { RememberPasswordComponent } from './components/remember-password/remember-password.component';
import {ThemeModule} from './theme/theme.module';
import {lightTheme} from './theme/light-theme';
import {darkTheme} from './theme/dark-theme';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireStorageModule} from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ErrorComponent,
    MenuComponent,
    FooterComponent,
    UserAccountComponent,
    TopicComponent,
    TopicPostComponent,
    AddTopicComponent,
    AddPostDetailsComponent,
    ManagComponent,
    AlertComponent,
    DialogOverviewExampleDialogComponent,
    PlaceholderDirective,
    LoadingSpinnerComponent,
    RoleManagementComponent,
    ConfirmAccountComponent,
    RememberPasswordComponent,
    ImageCropperComponent,
    ImageUploadComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,

        ThemeModule.forRoot({
            themes: [lightTheme, darkTheme],
            active: 'light'
        }),
        ImageCropperModule,
        AngularFireModule.initializeApp({ // firebase credentials
        apiKey: 'AIzaSyBFWOe0q4FWNOhpVjZ8t0H-RROHE2wcxMo',
        authDomain: 'images-2be78.firebaseapp.com',
        storageBucket: 'images-2be78.appspot.com',
        projectId: 'images-2be78',
       }),
       AngularFireStorageModule
    ],
  providers: [
    {
    provide: MatDialogRef,
    useValue: {}
  }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddTopicComponent]
})
export class AppModule { }
