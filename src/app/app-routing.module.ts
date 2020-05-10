import {Input, NgModule, Output} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { TopicComponent } from './components/topic/topic.component';
import { TopicPostComponent } from './components/topic-post/topic-post.component';
import { AddTopicComponent } from './components/add-topic/add-topic.component';
import { AddPostDetailsComponent } from './components/add-post-details/add-post-details.component';
import {ManagComponent} from './components/manag/manag.component';
import {AuthGuard} from './auth/auth.guard';
import {AdminGuard} from './auth/admin.guard';
import {ConfirmAccountComponent} from './components/confirm-account/confirm-account.component';
import {RememberPasswordComponent} from './components/remember-password/remember-password.component';

const routes: Routes = [
  // default page
  {path: '', redirectTo: 'topic', pathMatch: 'full'},

  // accessible for everyone
  {path: 'topic', component: TopicComponent}, // display all topics
  {path: 'topic/:number', component: TopicPostComponent}, // display all topic details

  //   {
  //   path: 'topic',
  //   component: TopicComponent,
  //   children: [
  //     { path: ':number', component: TopicPostComponent },
  //   ]
  // },

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'confirm/:token', component: ConfirmAccountComponent},
  {path: 'remember', component: RememberPasswordComponent},

  // only for auth users
  {path: 'user-account', component: UserAccountComponent, canActivate: [AuthGuard]},
  {path: 'manag', component: ManagComponent, canActivate: [AuthGuard, AdminGuard]},

  {path: 'topic/add', component: AddTopicComponent, canActivate: [AuthGuard]}, // for add topic
  {path: 'topic/add/:postNumber', component: AddTopicComponent, canActivate: [AuthGuard]}, // for update topic

  {path: 'topic-details/add/:postDetailsNumber',
    component: AddPostDetailsComponent, canActivate: [AuthGuard]},  // for add post inside topic
  {path: 'topic-details/update/:postNumber/update/:postDetailsNumber',
    component: AddPostDetailsComponent, canActivate: [AuthGuard]}, // for update post inside topic

  // for not existing path
  { path: '**', redirectTo: 'topic' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
