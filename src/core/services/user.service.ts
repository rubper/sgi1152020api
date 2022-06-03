import { Injectable } from '@nestjs/common';

import { Observable, of, from } from 'rxjs';
import { FindConditions, FindOneOptions, FindOperator } from 'typeorm';

import { UUID } from 'types/uuid.type';
import { User } from 'models/user.model';
import { CreateUserDTO } from 'interfaces/DTOs/user.create.dto';
import { UpdateUserDTO } from 'interfaces/DTOs/user.update.dto';
import { isUUIDValid } from 'shared/helpers/functions/is-uuid-valid.function';

@Injectable()
export class UserService {
  create(createDto: CreateUserDTO) {
    return new User(createDto).save();
  }

  findAll() {
    return User.find();
  }

  findOne(id: string) {
    return User.findOne(id);
  }

  searchUser(user: UUID | string | User| Observable<User>): Observable<User>  {
    let user$: Observable<User>;
    if (user instanceof Observable) {
      user$ = user;
    } else if (user instanceof User) {
      user$ = of(user);
    } else if (isUUIDValid(user)) {      
      user$ = from(
        this.findOne(user)
      );
    } else {
      user$ = from(
        this.findByUsername(user)
      );
    }
    return user$;
  }

  update(id: string, updateDto: UpdateUserDTO) {
    return User.findOne(id).then(
      (user: User) => {
        user.mapValueFromBase(updateDto);
        user.save();
      }
    );
  }

  remove(id: string) {
    return User.findOne(id).then(
      (user: User) => {
        user.softRemove();
      }
    );
  }

  async findByUsername(username: string): Promise<User> {
    const findByUsernameOperator: FindOperator<string> = new FindOperator<string>('equal', username);
    const findConditions: FindConditions<User> = {
      username: findByUsernameOperator
    };
    const findOneOptions: FindOneOptions<User> = {
      where: findConditions
    };
    return User.findOne(null, findOneOptions);
  }
}