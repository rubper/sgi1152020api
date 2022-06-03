import { UUID } from 'types/uuid.type';
import { IReport } from './report.interface';
import { IResource } from './_resource.interface';

export interface IReportDetail extends IResource {
  x: string;
  y: string;
  z?: string;
  xx?: string;
  yy?: string;
  zz?: string;
  report: IReport | UUID;
}