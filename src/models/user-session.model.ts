import { ISession } from 'auth/interfaces/session.interface';
import { Moment } from 'moment';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.model';

@Entity()
export class Session extends BuildableEntity<ISession> implements ISession {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({type: 'timestamp'})
  sessionStart: Moment;

  @Column({type: 'timestamp', nullable: true})
  sessionEnd?: Moment;

  @Column({type: 'boolean'})
  isActive: boolean;

  @Column({type: 'text'})
  token: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn({nullable: true})
  deleted_at?: string;

  //relationships
  @ManyToOne(() => User, user => user.sessions)
  user: User;
}