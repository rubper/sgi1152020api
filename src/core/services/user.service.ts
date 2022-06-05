import { Injectable } from '@nestjs/common';

import { Observable, of, from } from 'rxjs';
import { FindConditions, FindManyOptions, FindOneOptions, FindOperator } from 'typeorm';

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

  findOne(id: string): Promise<User> {
    return User.findOne(id);
  }

  searchUser(user: UUID | string | User| Observable<User>): Observable<User>  {
    let user$: Observable<User>;
    const userIsString = typeof user === 'string';
    const hasValidUUID = userIsString ? isUUIDValid(user) : false;
    if (userIsString && hasValidUUID) {
      user$ = from(
        this.findOne(user)
      );
    } else if (userIsString) {
      user$ = from(
        this.findByUsername(user)
      );
    } else if (user instanceof Observable) {     
      user$ = user; 
    } else {
      user$ = of(user);
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

  alreadyExists(username: string): Promise<boolean> {
    const options: FindManyOptions<User> = {
      where: {username}
    }
    return User.count(options).then(
      (count: number) => count > 0
    );
  }
}