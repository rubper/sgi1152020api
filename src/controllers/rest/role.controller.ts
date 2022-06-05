import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { Role } from 'models/role.model';
import { RoleService } from 'core/services/role.service';
import { CreateRoleDTO } from 'interfaces/DTOs/role.create.dto';
import { UpdateRoleDTO } from 'interfaces/DTOs/role.update.dto';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { AuthGuard } from 'auth/helpers/auth.guard';
import { RolesGuard } from 'auth/helpers/roles.guard';

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