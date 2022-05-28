import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IUserProfile } from 'interfaces/user-profile.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

export class UserProfile extends BuildableEntity<IUserProfile> implements IUserProfile {
  uuid: UUID;
  user: User;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  additionalPhones?: string[];
}
