import { ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { SetRoles } from 'auth/helpers/auth.decorators';
import { RolesGuard } from 'auth/helpers/roles.guard';
import { PermissionService } from 'core/services/permission.service';
import { CreatePermissionDTO } from 'interfaces/DTOs/permission.create.dto';
import { RemovePermissionDTO } from 'interfaces/DTOs/permission.remove.dto';
import { RoleService } from 'core/services/role.service';
import { AllowPermissionDTO } from 'interfaces/DTOs/permission.allow.dto';
import { RestrictPermissionDTO } from 'interfaces/DTOs/permission.restrict.dto';

@Controller('permission')
@SetRoles()
@UseGuards(RolesGuard)
export class PermissionController {
  constructor(
    private readonly _roleService: RoleService,
    private readonly _permissionService: PermissionService
    ) {}

  @Post('grant-role')
  @ApiBody({type: AllowPermissionDTO})
  addRoleToUser(@Body() allowPermissionDTO: AllowPermissionDTO) {
    return this._roleService.addRolesToUser(allowPermissionDTO.userId, allowPermissionDTO.roleIds);
  }
  @Post('remove-role')
  @ApiBody({type: RestrictPermissionDTO})
  removeRoleFromUser(@Body() restrictPermissionDTO: RestrictPermissionDTO) {
    return this._roleService.removeRolesFromUser(restrictPermissionDTO.userId, restrictPermissionDTO.roleIds)
  }

  @Post('create-permission')
  @ApiBody({type: CreatePermissionDTO})
  allowRoleToRoute(@Body() createPermissionDTO: CreatePermissionDTO) {
    return this._permissionService.allowRoleToRoute(createPermissionDTO.routeId, createPermissionDTO.roleIds);
  }
  
  @Post('delete-permission')
  @ApiBody({type: RemovePermissionDTO})
  removeRolePermissionToRoute(@Body() createPermissionDTO: RemovePermissionDTO) {
    return this._permissionService.removeRolePermissionToRoute(createPermissionDTO.routeId, createPermissionDTO.roleIds);
  }
}