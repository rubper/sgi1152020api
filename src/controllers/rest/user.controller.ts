import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { catchError, map, Observable, of } from 'rxjs';

import { Volunteer } from 'models/volunteer.model';
import { UserService } from 'core/services/user.service';
import { SgiResponse } from 'interfaces/_response.interface';
import { UpdateUserDTO } from 'DTOs/user.update.dto';
import { SecurityService } from 'auth/services/security.service';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';
import { User } from 'models/user.model';
import { RegisterBody } from 'auth/models/register.body-request';
import { LoginResult } from 'auth/interfaces/_login-result.interface';
import { RegisterResult } from 'auth/interfaces/_register-result.interface';
import { RolesGuard } from 'auth/helpers/roles.guard';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { Role } from 'models/role.model';
import { AllowPermissionDTO } from 'DTOs/permission.allow.dto';
import { RestrictPermissionDTO } from 'DTOs/permission.restrict.dto';

@Controller('user')
@SetRoles()
@ApiTags('3. Usuarios')
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private _securityService: SecurityService,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterBody })
  create(
    @Body() bodyRequest: RegisterRequest,
    @Res() res: Response,
  ): Observable<Response<SgiResponse>> {
    return this._securityService.register(bodyRequest).pipe(
      catchError((loginError): Observable<RegisterResult> => {
        console.log(loginError);

        const result: LoginResult = {
          success: false,
          message: 'error while trying to register',
          errorDetail: loginError,
        };
        return of(result);
      }),
      map((result: RegisterResult) => {
        if (result.errorDetail) {
          const response =
            this._securityService.createLoginErrorResponseObject(result);
          return res.status(response.statusCode).send(response);
        }
        const response: SgiResponse = {
          statusCode: 201,
          message: result.message,
          data: result,
        };
        return res.status(201).json(response);
      }),
    );
  }

  @Get()
  @ApiResponse({ type: User, isArray: true })
  findAll() {
    return this._userService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: User })
  findOne(@Param('id') id: string) {
    return this._userService.findOne(id);
  }

  @Get(':id/roles')
  @ApiResponse({ type: Role, isArray: true })
  getUserRoles(@Param('id') id: string) {
    return this._userService.getUserRoles(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({ type: Volunteer })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this._userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ type: null })
  remove(@Param('id') id: string) {
    return this._userService.remove(id);
  }

  @Post('roles/add')
  @ApiBody({
    type: AllowPermissionDTO,
    description:
      'Requiere el UUID del usuario, y los roles que se le daran en un arreglo de UUIDs de roles.',
  })
  @ApiResponse({ type: User })
  addUserRole(
    @Param('id') id: string,
    @Body() allowPermissionDTO: AllowPermissionDTO,
  ) {
    return this._userService.addUserPermissions(
      allowPermissionDTO.userId,
      allowPermissionDTO.roleIds,
    );
  }

  @Post('roles/remove')
  @ApiBody({
    type: RestrictPermissionDTO,
    description:
      'Requiere el UUID del usuario, y los roles que se le quitaran en un arreglo de UUIDs de roles.',
  })
  @ApiResponse({ type: User })
  removeUserRole(
    @Param('id') id: string,
    @Body() allowPermissionDTO: RestrictPermissionDTO,
  ) {
    return this._userService.removeUserPermissions(
      allowPermissionDTO.userId,
      allowPermissionDTO.roleIds,
    );
  }
}
