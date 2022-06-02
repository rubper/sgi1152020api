import { IResource } from './_resource.interface';
import { IUser } from 'auth/interfaces/user.interface';
import { ITimestampable } from './_timestampable.interface';
import { User } from 'models/user.model';
import { Tour } from 'models/tour.model';

export interface ISale extends IResource, Partial<ITimestampable> {
  amount: number;
  seller: IUser;
  ownerFirstName: string;
  ownerLastName: string;
  user?: User;
  identityDocument: string;
  tour: Tour;
}