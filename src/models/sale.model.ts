import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { ISale } from 'interfaces/sale.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Sale extends BuildableEntity<ISale> implements ISale {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;
  
  @Column('decimal')
  amount: number;
  
  @CreateDateColumn({nullable: true})
  created_at?: string;
  
  @UpdateDateColumn({nullable: true})
  updated_at?: string;
  
  @DeleteDateColumn({nullable: true})
  deleted_at?: string;
  
  // relationships
  @ManyToOne(type => User, user => user.sales)
  seller: User;
}
