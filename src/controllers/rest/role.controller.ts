import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpException } from '@nestjs/common';

import { Role } from 'models/role.model';
import { RoleService } from 'core/services/role.service';
import { CreateRoleDTO } from 'DTOs/role.create.dto';
import { UpdateRoleDTO } from 'DTOs/role.update.dto';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { AuthGuard } from 'auth/helpers/auth.guard';
import { RolesGuard } from 'auth/helpers/roles.guard';
import { UUID } from 'types/uuid.type';
import { isUUIDValid } from 'shared/helpers/functions/is-uuid-valid.function';

@Controller('role')
@SetRoles()
@UseGuards(RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBody({type: CreateRoleDTO})
  create(@Body() createRoleDto: CreateRoleDTO) {
    return this.roleService.create(createRoleDto);
  }
  
  @Get(':id/routes')
  @ApiParam({
    name: 'id',
    description: 'Requiere el UUID del rol'
  })
  @ApiResponse({description: 'Obtiene las rutas a la que este rol tiene acceso', isArray: true})
  getRoutes(@Param('id') id: UUID) {
    if (!isUUIDValid(id)) {
      throw new HttpException('UUID invalid', 400)
    }
    return this.roleService.getRoleRoutes(id);
  }

  @Get()
  @ApiResponse({type: Role, isArray: true})
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Role})
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateRoleDTO})
  @ApiResponse({type: Role})
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDTO) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}