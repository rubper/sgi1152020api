import { IUser } from './user.interface';
import { LoginResult } from './_login-result.interface';

export type UserRegisterResult = Omit<IUser, 'passwordHash' | 'passwordSalt' | 'secretHash'>;

export interface RegisterResult extends LoginResult {
  createdUser?: UserRegisterResult;
}