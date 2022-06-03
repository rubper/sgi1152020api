import { IResource } from 'interfaces/_resource.interface';
import { ITimestampable } from 'interfaces/_timestampable.interface';
import { Moment } from 'moment';
import { UUID } from 'types/uuid.type';
import { IUser } from './user.interface';

export interface ISession extends IResource, ITimestampable {
  user: IUser | UUID,
  sessionStart: Moment | string,
  sessionEnd?: Moment | string,
  isActive: boolean,
  token: string,
}