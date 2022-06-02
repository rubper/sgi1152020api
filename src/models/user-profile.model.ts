import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IUserProfile } from 'interfaces/user-profile.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, OneToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Separators } from 'constants/separators.constant';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserProfile extends BuildableEntity<IUserProfile> implements IUserProfile {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    required: false
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    required: false
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'Numero de telefono del usuario',
    required: false
  })
  @Column({nullable: true})
  phone?: string;

  @ApiProperty({
    description: 'Correo electronico del usuario',
    required: false
  })
  @Column({nullable: true})
  email?: string;

  @ApiProperty({
    description: 'Numeros telefonicos extra',
    required: false
  })
  @Column({nullable: true, type: 'text'})
  additionalPhonesString?: string;

  // relationships
  @ApiProperty({
    description: 'Usuario asignado a este perfil',
    required: false
  })
  @OneToOne(type => User, user => user.profile)
  user: User;

  get additionalPhones(): string[] {
    return this.additionalPhonesString ? this.additionalPhonesString.split(Separators.DATA) : [];
  }
}
