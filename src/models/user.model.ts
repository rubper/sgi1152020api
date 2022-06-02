import { Role } from './role.model';
import { UUID } from 'types/uuid.type';
import { UserProfile } from './user-profile.model';
import { IUser } from 'auth/interfaces/user.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, CreateDateColumn, DeleteDateColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, Entity, ManyToMany } from 'typeorm';
import { Guide } from './guide.model';
import { Report } from './report.model';
import { Sale } from './sale.model';
import { Session } from './user-session.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BuildableEntity<IUser> implements IUser {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: true
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Nombre de usuario unico',
    required: true
  })
  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: string;

  @Column({nullable: true})
  secretHash?: string;

  @ApiProperty({
    description: 'Roles del usuario',
    required: false
  })
  @ManyToMany(type => Role, role => role.users)
  roles?: Role[];

  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la creacion del registro',
    required: false
  })
  @CreateDateColumn()
  created_at: string;
  
  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la edicion del registro',
    required: false
  })
  @UpdateDateColumn()
  updated_at: string;
  
  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la eliminacion del registro',
    required: false
  })
  @DeleteDateColumn({nullable: true})
  deleted_at?: string;

  @ApiProperty({
    description: 'Perfil de usuario',
    required: false
  })
  @OneToOne(() => UserProfile, profile => profile.user, {nullable: true})
  profile?: UserProfile;

  // relationships
  @ApiProperty({
    description: 'Guia asociado si existe',
    required: false
  })
  @OneToOne(() => Guide, guide => guide.user, {nullable: true})
  guide?: Guide;

  @ApiProperty({
    description: 'Reporte asociados si existen',
    required: false
  })
  @OneToMany(() => Report, report => report.author)
  reports?: Report[];

  @ApiProperty({
    description: 'Ventas realizadas por el usuario',
    required: false
  })
  @OneToMany(() => Sale, sale => sale.seller)
  sales?: Sale[];

  @OneToMany(() => Session, session => session.user)
  sessions?: Session[];
}

