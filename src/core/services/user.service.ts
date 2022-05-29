import { Injectable } from '@nestjs/common';
import { IUser } from 'auth/interfaces/user.interface';
import { User } from 'models/user.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';
import { FindConditions, FindOneOptions, FindOperator } from 'typeorm';

@Injectable()
export class UserService {
  create(createDto: CreateDTO<IUser>) {
    new User(createDto).save();
  }

  findAll() {
    return User.find();
  }

  findOne(id: string) {
    return User.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<IUser>) {
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