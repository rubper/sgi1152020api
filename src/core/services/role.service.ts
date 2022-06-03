import { Injectable } from '@nestjs/common';

import { Role } from 'models/role.model';
import { CreateRoleDTO } from 'interfaces/DTOs/role.create.dto';
import { UpdateRoleDTO } from 'interfaces/DTOs/role.update.dto';

@Injectable()
export class RoleService {
  create(createDto: CreateRoleDTO) {
    return new Role(createDto).save();
  }

  findAll() {
    return Role.find();
  }

  findOne(id: string) {
    return Role.findOne(id);
  }

  update(id: string, updateDto: UpdateRoleDTO) {
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