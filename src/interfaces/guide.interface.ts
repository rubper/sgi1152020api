import { IResource } from './_resource.interface';
import { ITimestampable } from './_timestampable.interface';

import { IUser } from 'auth/interfaces/user.interface';

import { Moment } from 'moment';
import { ITour } from './tour.interface';
import { UUID } from 'types/uuid.type';

export interface IGuide extends IResource, ITimestampable {
  user: IUser | UUID;
  fixedHours: number;
  hoursAggregate: number;
  volunteershipStart: Moment | string;
  volunteershipEnd?: Moment | string;
  toursHistory?: (ITour | UUID)[];
}
