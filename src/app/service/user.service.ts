import {Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/user';
import { PasswordRenewDto } from '../dto/passwordRenewDto';
import {Role} from '../models/role';
import {Post} from '../models/post';
import {Image} from '../models/image';


// let API_URL = "http://localhost:8000/service/";
// gateway path
const API_URL = 'http://localhost:8765/api/user/service/';
const API_URL_MANAG = 'http://localhost:8765/api/user/manag/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: Observable<User>;
   currentUserSubject: BehaviorSubject<User>;
   userAdmin: BehaviorSubject<User>;
  roles: Array<Role>;
  private userList: Array<User>;
  userChanged = new Subject<Array<User>>();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser'))); // get current user from JSON
    this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): User {
    return this.currentUserSubject.value;
   }

     // set currentUser value to cookies
   login(user: User): Observable<any> {
     const headers = new HttpHeaders(
       user ? {
         authorization: 'Basic ' + btoa(user.username + ':' + user.password) // authorization
       } : {}
     );

     return this.http.get<any>(API_URL + 'login', {headers}).pipe(
       map(response => {
         if (response) {
           localStorage.setItem('currentUser', JSON.stringify(response));
           this.currentUserSubject.next(response);
         }
         return response;
       })
     );
   }

  // get logged in user if refreshed page
  autoLogin() {
    const userData: {
      userId: number;
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      enabled: boolean;
      role: Role;
      // img64: string;
      image: Image;
      // temp for register user
      confirmPassword: string;
    } = JSON.parse(localStorage.getItem('currentUser'));
    // if user isn't active return nothing => redirect to home page
    if (!userData) {
      return;
    }

    // console.log(userData); // debug
    // getting user authorities
    this.roles = userData['authorities'];
    // from these authorities trying to find ROLE_ADMIN
    // if role doesn't exist than value will be undefined
    const role = this.roles.find(ob => ob['authority'] === 'ROLE_ADMIN');

    // if we found admin role
    if (role !== undefined) {
      // passing value for the admin guard
      this.userAdmin = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.userAdmin.next(userData);
    }


   // if user has valid token == user is logged in
    if (userData !== null) {
      // make current active user
      this.currentUserSubject.next(userData);
    }
  }

   logOut(): Observable<any> {
    return this.http.post(API_URL + 'logout', {}).pipe(
      map(response => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }


  // send post request
   register(user: User): Observable<any> {
     return this.http.post(API_URL + 'registration', JSON.stringify(user),
     {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
   }

   // findAllUsers(): Observable<any> {
   //  return this.http.get(API_URL + 'all', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
   // }

  findAllUsers(page: number, size: number): Observable<any> {
    return this.http.get(API_URL + 'all?page=' + page + '&size=' + size,
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  findUserByUsername(username: string): Observable<any> {
    return this.http.get(API_URL + 'findUserByUsername?username=' + username,
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  findUserApproxByUsername(username: string, page: number, size: number): Observable<any> {
    return this.http.get(API_URL + 'findApproxUserByUsername?username=' + username + '&page=' + page + '&size=' + size,
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

   enableUser(username: string) {
     const url = API_URL_MANAG + username + '/enable';
     return this.http.put(url, { withCredentials: true });
   }

   disableUser(username: string) {
    const url = API_URL_MANAG + username + '/disable';
    return this.http.put(url, { withCredentials: true });
   }

   showUserDetail(username: string): Observable<any> {
    return  this.http.get(API_URL + username, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  changeUserDetails(user: User, username: string): Observable<any> {

    return this.http.put(`${API_URL}` + username + '/accountInfo', JSON.stringify(user),
    {headers: {'Content-Type': 'application/json; charse=UTF-8'}}).pipe(
      map(response => {
        if (response) {
          localStorage.setItem('currentUser', JSON.stringify(response)); // refresh user component in the cookies
          if (response instanceof User) {
            this.currentUserSubject.next(response);
          }
        }
        return response;
      })

    );
  }

    changeUserPassword(passwordRenewDto: PasswordRenewDto, username: string): Observable<any> {

    // return this.http.post(`${API_URL}` + username + '/changePassword', JSON.stringify(passwordRenewDto),
    return this.http.put(`${API_URL}` + username + '/changePassword', JSON.stringify(passwordRenewDto),
    {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    // we don't need to set user to local storage HERE cuz the password doesn't display
  }

  //   // user front display (in the front end cache)
  setUsers(userList: User[]) {
    this.userList = userList;
    this.userChanged.next(this.userList.slice());
  }
  updateUser(user: User, ind: number) {
    this.userList[ind] = user;
    this.userChanged.next(this.userList.slice());
  }
  getUser() {
    return this.userList.slice();
  }

  displayUserRoles(username: string): Observable<any> {
    return this.http.get(`${API_URL_MANAG}` + username + '/roleManagement', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  assignUserRole(username: string, roleId: number) {
    return this.http.put(`${API_URL_MANAG}` + username + '/assignRole/' + roleId, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  deleteUserRole(username: string, roleId: number) {
    return this.http.put(`${API_URL_MANAG}` + username + '/removeRole/' + roleId, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  deleteUserAccount(username: string, password: string) {
    return this.http.delete(`${API_URL}` + 'delete/' + username + '?enteredPassword=' + password, {headers:  {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  confirmUser(token: string): Observable<any> {
    return this.http.put(API_URL + 'registrationConfirm?token=' + token, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  resetPassword(email: string): Observable<any> {
    return this.http.put(API_URL + 'resetPassword?email=' + email, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  // updateImg(username: string, img64: string): Observable<any> { // update img base64 to the db
  //   return this.http.put(API_URL + username + '/setImg?imagebase64=' + img64, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  // }
  updateImg(username: string, imageUrl: string): Observable<any> { // update image to firebase storage
    // console.log('service url ' + imageUrl); // debug: firebase storage url to the saved image
    return this.http.put(API_URL + username + '/setImg?imageUrl=' + imageUrl, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
}
