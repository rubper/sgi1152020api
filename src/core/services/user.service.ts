import { HttpException, Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { Observable, of, from, map, first, filter, switchMap, combineLatest } from 'rxjs';
import { FindConditions, FindManyOptions, FindOneOptions, FindOperator } from 'typeorm';

import { UUID } from 'types/uuid.type';
import { User } from 'models/user.model';
import { CreateUserDTO } from 'DTOs/user.create.dto';
import { UpdateUserDTO } from 'DTOs/user.update.dto';
import { isUUIDValid } from 'shared/helpers/functions/is-uuid-valid.function';
import { UserProfile } from 'models/user-profile.model';
import { Role } from 'models/role.model';
import { AuthErrors } from 'auth/helpers/auth.errors';
import { IUser } from 'auth/interfaces/user.interface';
import { genSalt, hash } from 'bcrypt';
import { DevEnvironment } from 'constants/dev-environment.constant';

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
      async (user: User) => {
        if(user && user['username'] && user['username'] === 'admin') {
          throw new HttpException(AuthErrors.ADMINCHANGE_ERROR, 400);
        }
        if (updateDto.username) {
          user['username'] = updateDto.username;
        } 
        if (updateDto.profile) {
          user['profile'] = await UserProfile.findOne(updateDto.profile);
        } 
        if (updateDto.roles) {
          user['roles'] = await Role.findByIds(updateDto.roles);
        }
        return user.save();
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

  async addUserPermissions(userId: UUID, roleId: UUID | UUID[]) {
    const roleIds: UUID[] = typeof roleId === 'string' ? [roleId] : roleId;
    const user: User = await User.findOne(userId);
    const roles: Role[] = await Role.find<Role>({
      where: roleIds.map(role => ({uuid: role}))
    });
    const userRoles = user.roles.concat(roles);
    user.roles = userRoles;
    return user.save();
  }
  
  async removeUserPermissions(userId: UUID, roleId: UUID | UUID[]) {
    const roleIds = typeof roleId === 'string' ? [roleId] : roleId;
    const user: User = await User.findOne({
      relations: ['roles'],
      where: {uuid: userId}
    });
    const userRoles = user.roles.filter((role: Role) => !roleIds.includes(role.uuid));
    user.roles = userRoles;
    return user.save();
  }

  getUserRoles(id: UUID): Observable<Role[]> {
      return from(
        User.findOne({
          relations:['roles'],
          where: {uuid: id}
        })
      ).pipe(
        map((user: User) => user.roles)
      )
    }

  generateFakeUsers(usersQuantity: number) {
    return from(User.find())
      .pipe(
        first(),
        filter(
          (users: User[]) => users.length < usersQuantity
        ),
        switchMap(
          async (users: User[]) => {
            const usersResult: Observable<User>[] = [];
            for (let index = 1; index <= usersQuantity; index++) {
              const fakeSalt = await genSalt();
              const fakePass = `fakepass${index}`;
              const fakeHash = hash(fakePass, fakeSalt)
              const user: Partial<IUser> = {
                username: `fakeUser${index}`,
                passwordHash: await fakeHash,
                passwordSalt: fakeSalt,
              };
              const newUser = new User(user);
              const userResult = from(newUser.save());
              usersResult.push(userResult);
            }
            return combineLatest(usersResult);
          }
        )
      )
  }
}