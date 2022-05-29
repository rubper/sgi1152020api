import { Guide } from './guide.model';
import { UUID } from 'types/uuid.type';
import { TourTypes } from 'constants/tour-types.constant';

import { ITour } from 'interfaces/tour.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import { Moment } from 'moment';
import { Column, CreateDateColumn, DeleteDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Entity } from 'typeorm';

@Entity()
export class Tour extends BuildableEntity<ITour> implements ITour {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column({type: 'timestamp'})
  date: Moment;

  @Column()
  type: TourTypes;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn()
  deleted_at?: string;

  // relationships
  @ManyToOne(type => Guide, guide => guide.toursHistory)
  guide: Guide;
}
