import { IResource } from 'interfaces/_resource.interface';
import { IUser } from './user.interface';

export interface IRole extends IResource {
  name: string;
  title?: string;
  users?: IUser[]; 
}
