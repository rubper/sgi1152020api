import { IResource } from './_resource.interface';
import { IUser } from 'auth/interfaces/user.interface';

export interface IUserProfile extends IResource {
  user: IUser;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  additionalPhones?: string[];
}