import { Role } from './role.model';
import { UUID } from 'types/uuid.type';
import { UserProfile } from './user-profile.model';
import { IUser } from 'auth/interfaces/user.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, CreateDateColumn, DeleteDateColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, Entity } from 'typeorm';
import { Guide } from './guide.model';
import { Report } from './report.model';
import { Sale } from './sale.model';

@Entity()
export class User extends BuildableEntity<IUser> implements IUser {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: string;

  @Column({nullable: true})
  secretHash?: string;

  @OneToMany(type => Role, role => role.users)
  roles?: Role[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn({nullable: true})
  deleted_at?: string;

  @OneToOne(type => UserProfile, profile => profile.user)
  profile: UserProfile;

  // relationships
  @OneToMany(type => Guide, guide => guide.user)
  guides?: Guide[];

  @OneToMany(type => Report, report => report.author)
  reports?: Report[];

  @OneToMany(type => Sale, sale => sale.seller)
  sales?: Sale[];
}

