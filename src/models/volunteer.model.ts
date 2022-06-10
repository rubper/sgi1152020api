import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentReason } from 'constants/enrollment-reason.constant';
import { IVolunteer } from 'interfaces/volunteer.interface';

@Entity()
export class Volunteer
  extends BuildableEntity<IVolunteer>
  implements IVolunteer
{
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false,
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description:
      'Estampa de fecha que marca el inicio del voluntariado' +
      'Debe proveerse en formato estándar ISO 8601 (ISO String).',
    required: true,
  })
  @Column({ type: 'timestamp' })
  volunteershipStart: Moment;

  @ApiProperty({
    description:
      'Estampa de fecha que marca el fin del voluntariado' +
      'Debe proveerse en formato estándar ISO 8601 (ISO String).',
    required: false,
  })
  @Column({ type: 'timestamp', nullable: true })
  volunteershipEnd?: Moment;

  @ApiProperty({
    description:
      'Estampa autogenerada de fecha que marca la creacion del registro',
    required: false,
    readOnly: true,
  })
  @CreateDateColumn()
  created_at: string;

  @ApiProperty({
    description:
      'Estampa autogenerada de fecha que marca la edicion del registro',
    required: false,
    readOnly: true,
  })
  @UpdateDateColumn()
  updated_at: string;

  @ApiProperty({
    description:
      'Estampa autogenerada de fecha que marca la eliminacion del registro',
    required: false,
    readOnly: true,
  })
  @DeleteDateColumn({ nullable: true })
  deleted_at?: string;

  // relationships
  @ApiProperty({
    description: 'El usuario asociado al guía.',
    required: true,
  })
  @OneToOne(() => User, (user) => user.volunteer)
  @JoinColumn()
  user: User;

  @ApiProperty({
    description: 'La carrera cursada actualmente por el solicitante.',
    required: false,
  })
  @Column({ nullable: true })
  carreer?: string;
  @ApiProperty({
    description: 'El numero de telefono del solicitante.',
    required: false,
  })
  @Column({ nullable: true })
  telephone?: string;
  @ApiProperty({
    description: 'El correo electronico del solicitante.',
    required: false,
  })
  @Column({ nullable: true })
  email?: string;
  @ApiProperty({
    description:
      'Otras organizaciones en las que el solicitante ha sido voluntario.',
    required: false,
  })
  @Column({ nullable: true })
  previousExperience?: string;
  @ApiProperty({
    description:
      'Medio por el que se entero el voluntario o voluntaria, del programa.',
    required: false,
  })
  @Column({ nullable: true })
  media?: string;
  @ApiProperty({
    description: 'Motivo por el cual el voluntario entro al programa.',
    required: false,
  })
  @Column({ nullable: true })
  reason: EnrollmentReason;
}
