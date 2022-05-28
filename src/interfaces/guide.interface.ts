import { IResource } from './_resource.interface';
import { ITimestampable } from './_timestampable.interface';

import { IUser } from 'auth/interfaces/user.interface';

import { Moment } from 'moment';
import { ITour } from './tour.interface';

export interface IGuide extends IResource, ITimestampable {
  user: IUser;
  fixedHours: number;
  hoursAggregate: number;
  volunteershipStart: Moment;
  volunteershipEnd?: Moment;

  toursHistory: ITour[];
}
