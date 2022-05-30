import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from 'core/services/user.service';
import { IUser } from 'auth/interfaces/user.interface';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';
import { SecurityService } from 'auth/services/security.service';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private _securityService: SecurityService,
  ) {}

  @Post('register')
  create(@Body() createUserDto: RegisterRequest) {
    return this._securityService.register(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateDTO<IUser>) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}