import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from 'core/services/role.service';
import { IRole } from 'auth/interfaces/role.interface';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateRoleDTO } from 'interfaces/DTOs/role.create.dto';
import { UpdateRoleDTO } from 'interfaces/DTOs/role.update.dto';
import { Role } from 'models/role.model';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBody({type: CreateRoleDTO})
  create(@Body() createRoleDto: CreateDTO<IRole>) {
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
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateDTO<IRole>) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}