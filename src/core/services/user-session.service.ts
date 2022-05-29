import { Injectable } from '@nestjs/common';
import { ISession } from 'auth/interfaces/session.interface';
import { Session } from 'models/user-session.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class UserSessionService {
  create(createDto: CreateDTO<ISession>) {
    new Session(createDto).save();
  }

  findAll() {
    return Session.find();
  }

  findOne(id: string) {
    return Session.findOne(id);
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