import { IResource } from 'interfaces/_resource.interface';
import { ITimestampable } from 'interfaces/_timestampable.interface';
import { Moment } from 'moment';
import { IUser } from './user.interface';

export interface ISession extends IResource, ITimestampable {
  user: IUser,
  sessionStart: Moment,
  sessionEnd?: Moment,
  isActive: boolean,
  token: string,
}