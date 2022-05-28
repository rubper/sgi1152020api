import { Guide } from './guide.model';
import { UUID } from 'types/uuid.type';
import { TourTypes } from 'constants/tour-types.constant';

import { ITour } from 'interfaces/tour.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import { Moment } from 'moment';

export class Tour extends BuildableEntity<ITour> implements ITour {
  uuid: UUID;
  date: Moment;
  guide: Guide;
  type: TourTypes;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
