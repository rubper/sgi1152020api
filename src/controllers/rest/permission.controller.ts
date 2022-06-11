import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { SetRoles } from 'auth/helpers/auth.decorators';
import { RolesGuard } from 'auth/helpers/roles.guard';
import { PermissionService } from 'core/services/permission.service';
import { CreatePermissionDTO } from 'DTOs/permission.create.dto';
import { RemovePermissionDTO } from 'DTOs/permission.remove.dto';
import { RoleService } from 'core/services/role.service';
import { AllowPermissionDTO } from 'DTOs/permission.allow.dto';
import { RestrictPermissionDTO } from 'DTOs/permission.restrict.dto';

@Controller('permission')
@SetRoles()
@ApiTags('Operaciones de permisos de ruta')
@UseGuards(RolesGuard)
export class PermissionController {
  constructor(
    private readonly _roleService: RoleService,
    private readonly _permissionService: PermissionService
    ) {}

  @Post('grant-role')
  @ApiBody({type: AllowPermissionDTO})
  @ApiOperation({ 
    description: 'Este endpoint le otorga un rol a un usuario, ' +
    'debe proveerse un DTO de permiso de rol: ' + 
    'un objecto que contiene el ID de usuario en su propiedad userId ' +
    'y un arreglo de IDs de roles en su propiedad roleIds. Por ejemplo: \n' +
    `
        {
            "userId": "df0e7fcd-9cfb-4647-83f0-2d4b432e5643",
            "roleIds": [
                "4a4203bc-78fe-4020-bf1c-50ee789ad167",
                "4a4203bc-78fe-4020-bf1c-50ee789ad167"
            ] 
        }
    `
  })
  addRoleToUser(@Body() allowPermissionDTO: AllowPermissionDTO) {
    return this._roleService.addRolesToUser(allowPermissionDTO.userId, allowPermissionDTO.roleIds);
  }
  @Post('remove-role')
  @ApiOperation({
    description: 'Este endpoint le quita un rol a un usuario, ' + 
    'debe proveerse un DTO de restriccion: ' + 
    'un objecto que contiene el ID de usuario en su propiedad userId ' +
    'y un arreglo de IDs de roles en su propiedad roleIds. Por ejemplo: \n' +
    `
        {
            "userId": "df0e7fcd-9cfb-4647-83f0-2d4b432e5643",
            "roleIds": [
                "4a4203bc-78fe-4020-bf1c-50ee789ad167",
                "4a4203bc-78fe-4020-bf1c-50ee789ad167",
                "4a4203bc-78fe-4020-bf1c-50ee789ad167"
            ] 
        }
    `
  })
  @ApiBody({type: RestrictPermissionDTO})
  removeRoleFromUser(@Body() restrictPermissionDTO: RestrictPermissionDTO) {
    return this._roleService.removeRolesFromUser(restrictPermissionDTO.userId, restrictPermissionDTO.roleIds)
  }

  @Post('create-permission')
  @ApiOperation({
    description: 'Este endpoint permite a un rol acceder a una, ' + 
    'debe proveerse un DTO de permiso: ' + 
    'un objecto que contiene el ID de la ruta a permitir en su propiedad userId ' +
    'y un arreglo de IDs de roles en su propiedad roleIds, los cuales tendran acceso ' +
    'a la ruta especificada. Por ejemplo: \n' +
    `
        {
            "routeId": "df0e7fcd-9cfb-4647-83f0-2d4b432e5643",
            "roleIds": [
                "4a4203bc-78fe-4020-bf1c-50ee789ad167",
                "4a4203bc-78fe-4020-bf1c-50ee789ad167",
                "4a4203bc-78fe-4020-bf1c-50ee789ad167"
            ] 
        }
    `
  })
  @ApiBody({type: CreatePermissionDTO})
  allowRoleToRoute(@Body() createPermissionDTO: CreatePermissionDTO) {
    return this._permissionService.allowRoleToRoute(createPermissionDTO.routeId, createPermissionDTO.roleIds);
  }
  
  @Post('delete-permission')
  @ApiOperation({
    description: 'Este endpoint retira el permiso a un rol, de acceder a una ruta, ' + 
    'debe proveerse un DTO de permiso: ' + 
    'un objecto que contiene el ID de la ruta a permitir en su propiedad userId ' +
    'y un arreglo de IDs de roles en su propiedad roleIds, los cuales tendran acceso ' +
    'a la ruta especificada. Por ejemplo: \n' +
    `
        {
            "routeId": "df0e7fcd-9cfb-4647-83f0-2d4b432e5643",
            "roleIds": [
                "4a4203bc-78fe-4020-bf1c-50ee789ad167",
                "4a4203bc-78fe-4020-bf1c-50ee789ad167",
                "4a4203bc-78fe-4020-bf1c-50ee789ad167"
            ] 
        }
    `
  })
  @ApiBody({type: RemovePermissionDTO})
  removeRolePermissionToRoute(@Body() createPermissionDTO: RemovePermissionDTO) {
    return this._permissionService.removeRolePermissionToRoute(createPermissionDTO.routeId, createPermissionDTO.roleIds);
  }
}