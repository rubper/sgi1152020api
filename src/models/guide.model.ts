import { Tour } from './tour.model';
import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IGuide } from 'interfaces/guide.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import moment, { Moment } from 'moment';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Guide extends BuildableEntity<IGuide> implements IGuide {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;
  
  @Column({ type: 'decimal', default: 0 })
  fixedHours: number;
  
  @Column({ type: 'decimal', default: 0 })
  hoursAggregate: number;
  
  @Column({type: 'timestamp', default: moment().toISOString()})
  volunteershipStart: Moment;
  
  @Column({type: 'timestamp', nullable: true})
  volunteershipEnd?: Moment;
  
  @CreateDateColumn()
  created_at: string;
  
  @UpdateDateColumn()
  updated_at: string;
  
  @DeleteDateColumn({nullable: true})
  deleted_at?: string;
  
  // relationships
  @ManyToOne(type => User, user => user.guides)
  user: User;
  
  @OneToMany(type => Tour, tour => tour.guide)
  toursHistory?: Tour[];
}
