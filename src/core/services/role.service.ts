import { Injectable } from '@nestjs/common';

import { Observable, of, from } from 'rxjs';
import { FindOperator, FindConditions, FindOneOptions } from 'typeorm';

import { UUID } from 'types/uuid.type';
import { Role } from 'models/role.model';
import { CreateRoleDTO } from 'interfaces/DTOs/role.create.dto';
import { UpdateRoleDTO } from 'interfaces/DTOs/role.update.dto';
import { isUUIDValid } from 'shared/helpers/functions/is-uuid-valid.function';

@Injectable()
export class RoleService {
  
  async update(id: string, updateDto: UpdateRoleDTO) {
    const role = await Role.findOne(id);
    role.mapValueFromBase(updateDto);
    role.save();
  }

  async remove(id: string) {
    const role = await Role.findOne(id);
    role.softRemove();
  }

  async findByName(name: string): Promise<Role> {
    const findByUsernameOperator: FindOperator<string> = new FindOperator<string>('equal', name);
    const findConditions: FindConditions<Role> = {
      name: findByUsernameOperator
    };
    const findOneOptions: FindOneOptions<Role> = {
      where: findConditions
    };
    return Role.findOne(null, findOneOptions);
  }

  create(createDto: CreateRoleDTO) {
    return new Role(createDto).save();
  }

  findRole(role: UUID | string | Role| Observable<Role>): Observable<Role>  {
    let role$: Observable<Role>;
    if (role instanceof Observable) {
      role$ = role;
    } else if (role instanceof Role) {
      role$ = of(role);
    } else if (isUUIDValid(role)) {      
      role$ = from(
        this.findOne(role)
      );
    } else {
      role$ = from(
        this.findByName(role)
      );
    }
    return role$;
  }

  findAll(withDeleted?: boolean) {
    return Role.find({
      withDeleted: withDeleted ? true : false
    });
  }

  findOne(id: string) {
    return Role.findOne(id);
  }

}