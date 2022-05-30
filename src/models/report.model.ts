import { User } from './user.model';
import { UUID } from 'types/uuid.type';
import { ReportDetail } from 'models/report-detail.model';
import { ReportTypes } from 'constants/report-types.constant';

import { IReport } from 'interfaces/report.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity'

import { Moment } from 'moment';
import { Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report extends BuildableEntity<IReport> implements IReport {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column({type: 'timestamp'})
  date: Moment;

  @Column({length: 50})
  type: ReportTypes;
  
  // relationships
  @OneToMany(type => ReportDetail, detail => detail.report)
  reportDetails?: ReportDetail[];

  @ManyToOne(type => User, user => user.reports)
  author: User;
}
