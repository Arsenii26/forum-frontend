import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Post} from '../models/post';
import {PostDetails} from '../models/postDetails';
import {TopicComponent} from '../components/topic/topic.component';
import {User} from '../models/user';
import {environment} from '../../environments/environment';

// with server
// const API_URL = 'http://localhost:8765/api/topic/service/';
// without server
const API_URL = 'http://localhost:8001/api/topic/service/';
// with docker local
// const API_URL = 'http://192.168.99.100:8001/api/topic/service/';
// with kubernetes
// const API_URL = 'http://34.71.105.91:8001/api/topic/service/';
// with env variable
// const API_URL = 'https://' + environment.topicServiceIp + '/api/topic/service/';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private http: HttpClient) {

  }
  private postList: Array<Post>;
  postChanged = new Subject<Array<Post>>();
  private postDetailsList: Array<PostDetails>;
  postDetailsChanged = new Subject<Array<PostDetails>>();
  private userList: Array<User>;
  userListChanged = new Subject<Array<User>>();
  // array on the client side - in user cache (created by onInit method)
  setTopics(post: Post[]) {
    this.postList = post;
    this.postChanged.next(this.postList.slice());  // next - will trigger the component reload without page refreshing
  }
  // will add new values to the existing array
  setMoreTopics(post: Post[]) {
    for (const value of post) {
      this.postList.push(value);
    }
    this.postChanged.next(this.postList.slice());
  }
  getTopics() {
    return this.postList.slice();
  }
  updateTopic(newPost: Post, postNumber: number, ind: number) {
    this.postList[ind] = newPost;
    this.postChanged.next(this.postList.slice());
  }
  addTopic(post: Post) {
    this.postList.push(post);
    this.postChanged.next(this.postList.slice());
  }
  deleteTopic(ind: number) {
    this.postList.splice(ind, 1);
    this.postChanged.next(this.postList.slice());
  }
  getTopic(index: number) {
    return this.postList[index];
  }


  // array on the server side
  findAllPosts(): Observable<any> {
    return this.http.get(API_URL + 'all', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  // will order in desc or asc order by flexible value
  findAllPostsOrdered(orderBy: string, sortBy: string): Observable<any> {
    return this.http.get(API_URL + 'allLimited' + orderBy + '?sort=' + sortBy, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  // will load more items to array list on front-end side
  loadNextPage(orderBy: string, page: number, sortBy: string): Observable<any> {
    return this.http.get(API_URL + 'allLimited' + orderBy + '?page=' + page + '&sort=' + sortBy, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  // will add new post
  addPost(post: Post): Observable<any> {
    return this.http.post(API_URL + 'post', JSON.stringify(post),
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }
  updatePost(post: Post, postNumber: number): Observable<any> {
    // !!!!!!!!!!!! IF CORS NOT FIXED? !!!!!!!!!!!
    // return this.http.post(`${API_URL}post/${postNumber}`, JSON.stringify(post),
    return this.http.put(`${API_URL}post/${postNumber}`, JSON.stringify(post),
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  deletePost(postNumber: number): Observable<any> {
    // !!!!!!!!!!!! IF CORS NOT FIXED? !!!!!!!!!!!
    // return this.http.get(`${API_URL}post/delete/${postNumber}`);
    return this.http.delete(`${API_URL}post/delete/${postNumber}`);
  }

  showPost(postNumber: number): Observable<any> {
    return this.http.get(API_URL + 'post/' + postNumber, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  // post details
  // client side list
  // array on the client side
  setPostDetailsBrowser(postDetails: PostDetails[]) {
    this.postDetailsList = postDetails;
    this.postDetailsChanged.next(this.postDetailsList.slice());
  }
  setUserList(user: User[]) {
    this.userList = user;
    this.userListChanged.next(this.userList.slice());
  }
  getPostDetailsBrowser() {
    return this.postDetailsList.slice();
  }
  getUserList() {
    // console.log(this.userList); // debug
    return this.userList.slice();
  }
  updatePostDetailsBrowser(newPostDetails: PostDetails, postNumber: number, ind: number) {
    this.postDetailsList[ind] = newPostDetails;
    // console.log(newPostDetails); // debug
    // console.log(ind); // debug
    this.postDetailsChanged.next(this.postDetailsList.slice());
  }
  addPostDetailsBrowser(postDetails: PostDetails) {
    this.postDetailsList.push(postDetails);
    this.postDetailsChanged.next(this.postDetailsList.slice());
  }
  deletePostDetailsBrowser(ind: number) {
    this.postDetailsList.splice(ind, 1);
    this.postDetailsChanged.next(this.postDetailsList.slice());
  }


  // server side list
  addPostDetails(postDetails: PostDetails, postNumber: number): Observable<any> {
    return this.http.post(API_URL + 'post/' + postNumber + '/details', JSON.stringify(postDetails),
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  updatePostDetails(postDetails: PostDetails, postNumber: number, number: number): Observable<any> {

    return this.http.put(API_URL + 'post/' + postNumber + '/details/' + number, JSON.stringify(postDetails),
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  deletePostDetails(postNumber: number, number: number): Observable<any> {
    return this.http.delete(API_URL + 'post/' + postNumber + '/details/delete/' + number);
  }

  findAllPostsDetails(postNumber: number): Observable<any> {
    return this.http.get(API_URL + 'post/' + postNumber + '/details', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  showPostDetail(postNumber: number, number: number): Observable<any> {
    return this.http.get(API_URL + 'post/' + postNumber + '/details/' + number, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }


}
