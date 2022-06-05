import { UUID } from 'types/uuid.type';
import { IResource } from './_resource.interface';
import { IUser } from 'auth/interfaces/user.interface';

export interface IUserProfile extends IResource {
  user: IUser | UUID;
  firstName: string;
  lastName: string;
  identityDocument: string;
  phone?: string;
  email?: string;
  additionalPhonesString?: string;
}