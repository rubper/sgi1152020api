import { IResource } from 'interfaces/_resource.interface';
import { ITimestampable } from 'interfaces/_timestampable.interface';

import { IRole } from './role.interface';
import { IUserProfile } from 'interfaces/user-profile.interface';

export interface IUser extends IResource, ITimestampable {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  secretHash?: string;
  roles?: IRole[];
  profile: IUserProfile;
}
