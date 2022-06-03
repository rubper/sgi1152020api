import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { Guide } from 'models/guide.model';
import { UserService } from 'core/services/user.service';
import { UpdateUserDTO } from 'interfaces/DTOs/user.update.dto';
import { SecurityService } from 'auth/services/security.service';
import { CreateGuideDTO } from 'interfaces/DTOs/guide.create.dto';
import { UpdateGuideDTO } from 'interfaces/DTOs/guide.update.dto';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private _securityService: SecurityService,
  ) {}

  @Post('register')
  @ApiBody({type: CreateGuideDTO})
  create(@Body() createUserDto: RegisterRequest) {
    return this._securityService.register(createUserDto);
  }

  @Get()
  @ApiResponse({type: Guide, isArray: true})
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Guide})
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateGuideDTO})
  @ApiResponse({type: Guide})
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}