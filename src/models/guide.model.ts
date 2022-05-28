import { Tour } from './tour.model';
import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IGuide } from 'interfaces/guide.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import { Moment } from 'moment';

export class Guide extends BuildableEntity<IGuide> implements IGuide {
  uuid: UUID;
  user: User;
  fixedHours: number;
  toursHistory: Tour[];
  hoursAggregate: number;
  volunteershipStart: Moment;
  volunteershipEnd?: Moment;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
