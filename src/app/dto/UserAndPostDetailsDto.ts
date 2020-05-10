import {User} from '../models/user';
import {PostDetails} from '../models/postDetails';

export class UserAndPostDetailsDto {

  userList: Array<User>;
  detailsList: Array<PostDetails>;
}
