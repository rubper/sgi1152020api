import { Moment } from 'moment';

import { UUID } from 'types/uuid.type';
import { ISale } from './sale.interface';
import { IGuide } from './guide.interface';
import { IResource } from './_resource.interface';
import { TourTypes } from 'constants/tour-types.constant';
import { ITimestampable } from './_timestampable.interface';

export interface ITour extends IResource, ITimestampable {
  date: Moment | string;
  type: TourTypes;
  salesHistory?: (ISale | UUID)[];
}