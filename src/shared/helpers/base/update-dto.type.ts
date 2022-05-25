import { IResource } from 'interfaces/_resource.interface';
import { ITimestampable } from 'interfaces/_timestampable.interface';

export type UpdateDTO<T extends IResource> = Partial<Omit<T, keyof ITimestampable>>;