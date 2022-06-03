import { UUID } from 'types/uuid.type';
import { ITour } from './tour.interface';
import { IResource } from './_resource.interface';
import { IUser } from 'auth/interfaces/user.interface';
import { ITimestampable } from './_timestampable.interface';

export interface ISale extends IResource, Partial<ITimestampable> {
  amount: number;
  seller: IUser | UUID;
  ownerFirstName: string;
  ownerLastName: string;
  user?: IUser | UUID;
  identityDocument: string;
  tour: ITour | UUID;
}