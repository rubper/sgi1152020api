import { IUser } from 'auth/interfaces/user.interface';
import { ReportTypes } from 'constants/report-types.constant';
import { ValueTypes } from 'constants/value-types.constant';
import { Moment } from 'moment';
import { IReportDetail } from './report-detail.interface';
import { IResource } from './_resource.interface';

export interface IReport extends IResource {
  date: Moment;
  type: ReportTypes;
  dataType: ValueTypes;
  author: IUser;
  reportDetails?: IReportDetail[];
}
