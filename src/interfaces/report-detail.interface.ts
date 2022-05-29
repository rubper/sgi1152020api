import { IResource } from './_resource.interface';

export interface IReportDetail extends IResource {
  x: string;
  y: string;
  z?: string;
  xx?: string;
  yy?: string;
  zz?: string;
}