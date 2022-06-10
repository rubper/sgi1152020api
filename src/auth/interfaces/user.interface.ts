import { UUID } from 'types/uuid.type';
import { IRole } from './role.interface';
import { ISession } from './session.interface';
import { ISale } from 'interfaces/sale.interface';
import { IVolunteer } from 'interfaces/volunteer.interface';
import { IResource } from 'interfaces/_resource.interface';
import { IUserProfile } from 'interfaces/user-profile.interface';
import { ITimestampable } from 'interfaces/_timestampable.interface';

export interface IUser extends IResource, ITimestampable {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  secretHash?: string;
  profile?: IUserProfile | UUID;
  roles?: (IRole | UUID)[];
  sales?: (ISale | UUID)[];
  sessions?: (ISession | UUID)[];
  volunteer?: IVolunteer | UUID;
}
