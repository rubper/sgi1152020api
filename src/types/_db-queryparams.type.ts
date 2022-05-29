import { IResource } from '../interfaces/_resource.interface';

export type DbQueryParams<T extends IResource> = keyof T;