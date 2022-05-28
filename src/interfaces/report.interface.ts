import { IUser } from 'auth/interfaces/user.interface';
import { ReportTypes } from 'constants/report-types.constant';
import { Moment } from 'moment';
import { IResource } from './_resource.interface';
import { TableData } from '../shared/classes/_table-data.class';

export interface IReport extends IResource {
  date: Moment;
  data: TableData;
  type: ReportTypes;
  author: IUser;
}
