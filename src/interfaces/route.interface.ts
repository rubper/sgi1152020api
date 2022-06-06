import { IResource } from './_resource.interface';
import { IRole } from 'auth/interfaces/role.interface';

export interface IRoute extends IResource {
  name: string;
  roles?: IRole[];
}