import { IResource } from 'interfaces/_resource.interface';
import { ITimestampable } from 'interfaces/_timestampable.interface';

import { IRole } from './role.interface';
import { IUserProfile } from 'interfaces/user-profile.interface';
import { ISale } from 'interfaces/sale.interface';
import { ISession } from './session.interface';
import { Guide } from 'models/guide.model';

export interface IUser extends IResource, ITimestampable {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  secretHash?: string;
  profile: IUserProfile;
  roles?: IRole[];
  sales?: ISale[];
  sessions?: ISession[];
  guide?: Guide;
}
