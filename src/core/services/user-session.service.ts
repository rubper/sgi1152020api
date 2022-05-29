import { Injectable } from '@nestjs/common';
import { ISession } from 'auth/interfaces/session.interface';
import { Session } from 'models/user-session.model';
import { TypeORMOrder } from 'shared/helpers/base/buildable.entity';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';
import { DbFilterParams } from 'types/_db-filter-params.type';

@Injectable()
export class UserSessionService {
  create(createDto: CreateDTO<ISession>) {
    return new Session(createDto).save();
  }

  findAll() {
    return Session.find();
  }

  findOne(id: string) {
    return Session.findOne(id);
  }

  search(filters: DbFilterParams<Session>, order?: TypeORMOrder<Session>) {
    return Session.search<Session>(filters, order);
  }

  update(id: string, updateDto: UpdateDTO<ISession>) {
    return Session.findOne(id).then(
      (userSession: Session) => {
        userSession.mapValueFromBase(updateDto);
        userSession.save();
      }
    );
  }

  remove(id: string) {
    return Session.findOne(id).then(
      (userSession: Session) => {
        userSession.softRemove();
      }
    );
  }
}