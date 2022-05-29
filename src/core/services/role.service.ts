import { Injectable } from '@nestjs/common';
import { IRole } from 'auth/interfaces/role.interface';
import { Role } from 'models/role.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class RoleService {
  create(createDto: CreateDTO<IRole>) {
    new Role(createDto).save();
  }

  findAll() {
    return Role.find();
  }

  findOne(id: string) {
    return Role.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<IRole>) {
    return Role.findOne(id).then(
      (role: Role) => {
        role.mapValueFromBase(updateDto);
        role.save();
      }
    );
  }

  remove(id: string) {
    return Role.findOne(id).then(
      (role: Role) => {
        role.softRemove();
      }
    );
  }
}