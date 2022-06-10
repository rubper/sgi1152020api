import { UUID } from 'types/uuid.type';
import { IResource } from './_resource.interface';
import { IUser } from 'auth/interfaces/user.interface';
import { ITimestampable } from './_timestampable.interface';

export interface ISale extends IResource, Partial<ITimestampable> {
  amount: number;
  ownerEmail: string;
  ownerPhone: string;
  ownerFirstName: string;
  ownerLastName: string;
  user?: IUser | UUID;
  seller: IUser | UUID;
  kidsQuantity: number;
  adultsQuantity: number;
  total: number;
}
