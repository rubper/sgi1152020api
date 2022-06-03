import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';

import { catchError, map, Observable, of } from 'rxjs';

import { Guide } from 'models/guide.model';
import { UserService } from 'core/services/user.service';
import { SgiResponse } from 'interfaces/_response.interface';
import { UpdateUserDTO } from 'interfaces/DTOs/user.update.dto';
import { CONFIRMATION_ERROR, SecurityService } from 'auth/services/security.service';
import { CreateGuideDTO } from 'interfaces/DTOs/guide.create.dto';
import { UpdateGuideDTO } from 'interfaces/DTOs/guide.update.dto';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';
import { RegisterResult } from 'auth/interfaces/_register-result.interface';
import { LoginResult } from 'auth/interfaces/_login-result.interface';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private _securityService: SecurityService,
  ) {}

  @Post('register')
  @ApiBody({type: CreateGuideDTO})
  create(@Body() createUserDto: RegisterRequest, @Res() res: Response): Observable<Response<SgiResponse>> {
    return this._securityService
      .register(createUserDto)
      .pipe(
        catchError(
          (err: LoginResult): Observable<SgiResponse<LoginResult|Error>> => {
            let response: SgiResponse;
            if (err.message === CONFIRMATION_ERROR) {
              const error = err.errorDetail as Error;
              response = {
                statusCode: 400,
                message: error.message,
                data: error
              }
            } else {
              response = {
                statusCode: 500,
                message: err.message,
                data: err
              }
            }
            return of(response);
          }
        ),
        map(
          (response: SgiResponse) => res.status(201).json(response)
        )
      );
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