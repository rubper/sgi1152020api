import { IUser } from './user.interface';
import { LoginResult } from './_login-result.interface';

export interface RegisterResult extends LoginResult {
  createdUser?: IUser;
}