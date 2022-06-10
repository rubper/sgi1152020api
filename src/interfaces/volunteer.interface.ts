import { IResource } from './_resource.interface';
import { ITimestampable } from './_timestampable.interface';

import { IUser } from 'auth/interfaces/user.interface';

import { Moment } from 'moment';
import { UUID } from 'types/uuid.type';
import { EnrollmentReason } from 'constants/enrollment-reason.constant';

export interface IVolunteer extends IResource, ITimestampable {
  user: IUser | UUID;
  volunteershipStart: Moment | string;
  volunteershipEnd?: Moment | string;
  reason: EnrollmentReason;
  carreer?: string;
  telephone?: string;
  email?: string;
  previousExperience?: string;
  media?: string;
}
