import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { ISale } from 'interfaces/sale.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Sale extends BuildableEntity<ISale> implements ISale {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro.',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Cantidad de tickets por la que se realizo la venta.',
    required: true,
  })
  @Column()
  amount: number;

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

  @ApiProperty({
    description: 'Primer nombre del titular de la compra.',
    required: true,
  })
  @Column()
  ownerFirstName: string;

  @ApiProperty({
    description: 'Primer apellido del titular de la compra.',
    required: true,
  })
  @Column()
  ownerLastName: string;

  @ApiProperty({
    description: 'Correo electronico del titular de la compra.',
    required: true,
  })
  @Column()
  ownerEmail: string;

  @ApiProperty({
    description: 'Numero de telefono del titular de la compra.',
    required: true,
  })
  @Column()
  ownerPhone: string;

  @ApiProperty({
    description: 'Usuario del titular si existe.',
    required: false,
  })
  @ManyToOne(() => User, (user) => user.sales, { nullable: true })
  user?: User;

  // relationships
  @ApiProperty({
    description: 'El vendedor asociado a esta compra.',
    required: true,
  })
  @ManyToOne(() => User, (user) => user.sales)
  seller: User;
  @ApiProperty({
    description: 'Cantidad de ninos de la compra.',
    required: false,
  })
  @Column('integer')
  kidsQuantity: number;
  @ApiProperty({
    description: 'Cantidad de adultos de la compra.',
    required: false,
  })
  @Column('integer')
  adultsQuantity: number;
  @ApiProperty({
    description: 'Monto total por el que se realizo la venta.',
    required: true,
  })
  @Column('decimal')
  total: number;

  @BeforeInsert()
  @BeforeUpdate()
  private _calculateTickets() {
    this.amount = this.adultsQuantity + this.kidsQuantity;
  }
}
