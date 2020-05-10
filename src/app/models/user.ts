import {Role} from './role';
import {Image} from './image';

export class User {

  // user_id: number;
  userId: number;
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  enabled: boolean;
  role: Role;
  // img64: string = '';
  image: Image;

  // temp for register user
  confirmPassword: string = '';

  // the way to hide password
  // protected $hidden = ['password'];
  // static get hidden() {
  //   return ['password'];
  // }

}
