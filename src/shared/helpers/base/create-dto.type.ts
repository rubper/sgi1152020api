import { IResource } from 'interfaces/_resource.interface';
import { Resource } from 'types/resource.type';

export type CreateDTO<T extends IResource> = Partial<Omit<T, keyof Resource>>;
