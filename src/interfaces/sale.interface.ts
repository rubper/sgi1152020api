import { IResource } from './_resource.interface';
import { IUser } from 'auth/interfaces/user.interface';
import { ITimestampable } from './_timestampable.interface';

export interface ISale extends IResource, Partial<ITimestampable> {
  amount: number;
  seller: IUser;
}