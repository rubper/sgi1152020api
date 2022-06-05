import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IUserProfile } from 'interfaces/user-profile.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, OneToOne, PrimaryGeneratedColumn, Entity, Unique, JoinColumn } from 'typeorm';
import { Separators } from 'constants/separators.constant';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserProfile extends BuildableEntity<IUserProfile> implements IUserProfile {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false,
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    required: true
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    required: true
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
  
  @ApiProperty({
    description: 'Numero unico de identidad DUI del titular.',
    default: '00000000-0'
  })
  @Column({nullable: true, length: 10})
  identityDocument: string;

  // relationships
  @ApiProperty({
    description: 'Usuario asignado a este perfil',
    required: false,
    type: () => User
  })
  @OneToOne(() => User, user => user.profile)
  @JoinColumn()
  user: User;

  get additionalPhones(): string[] {
    return this.additionalPhonesString ? this.additionalPhonesString.split(Separators.DATA) : [];
  }
}
