import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IUserProfile } from 'interfaces/user-profile.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, OneToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Separators } from 'constants/separators.constant';

@Entity()
export class UserProfile extends BuildableEntity<IUserProfile> implements IUserProfile {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable: true})
  phone?: string;

  @Column({nullable: true})
  email?: string;

  @Column({nullable: true, type: 'text'})
  additionalPhonesString?: string;

  // relationships
  @OneToOne(type => User, user => user.profile)
  user: User;

  get additionalPhones(): string[] {
    return this.additionalPhonesString ? this.additionalPhonesString.split(Separators.DATA) : [];
  }
}
