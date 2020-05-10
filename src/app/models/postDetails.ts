// import { Post } from './post';

export class PostDetails {

  number: number;

  name: string = '';

  details: string = '';

  dateCreated: any;

  // post: Post;

  postNumber: number;
  userId: number;

  // username : string = "";


  constructor(number: number, name: string, details: string, dateCreated: any, postNumber: number, userId: number) {
    this.number = number;
    this.name = name;
    this.details = details;
    this.dateCreated = dateCreated;
    this.postNumber = postNumber;
    this.userId = userId;
  }

}
