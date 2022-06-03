import { Moment } from 'moment';

import { UUID } from 'types/uuid.type';
import { IResource } from './_resource.interface';
import { IReportDetail } from './report-detail.interface';
import { IUser } from 'auth/interfaces/user.interface';
import { ValueTypes } from 'constants/value-types.constant';
import { ReportTypes } from 'constants/report-types.constant';

export interface IReport extends IResource {
  date: Moment | string;
  type: ReportTypes;
  dataType: ValueTypes;
  author: IUser | UUID;
  reportDetails?: (IReportDetail | UUID)[];
}
