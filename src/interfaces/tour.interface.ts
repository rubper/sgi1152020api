import { TourTypes } from 'constants/tour-types.constant';
import { Moment } from 'moment';
import { IGuide } from './guide.interface';
import { ISale } from './sale.interface';
import { IResource } from './_resource.interface';
import { ITimestampable } from './_timestampable.interface';

export interface ITour extends IResource, ITimestampable {
  date: Moment;
  guide: IGuide;
  type: TourTypes;
  salesHistory?: ISale[];
}