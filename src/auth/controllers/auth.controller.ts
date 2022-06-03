import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';

import { catchError, map, Observable, of } from 'rxjs';
import { Response } from 'express';

import { LoginBody } from 'auth/models/login.body-request';
import { SgiResponse } from 'interfaces/_response.interface';
import { RegisterBody } from 'auth/models/register.body-request';
import { CONFIRMATION_ERROR, SecurityService } from 'auth/services/security.service';
import { LoginRequest } from 'auth/interfaces/_login-request.interface';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';
import { LoginResult } from 'auth/interfaces/_login-result.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _securityService: SecurityService,
  ) {}
  
  @Post('login')
  @ApiBody({
    type: LoginBody,
    description: 'Retorna un resultado de inicio de sesión, con una bandera de exito, un mensaje, ' +
    'y en caso de exito un token de acceso. Aparte del nombre de usuario y contraseña, debe recibir ' +
    'un tercer paramentro que debe ir vacío para atrapar bots indeseados.'
  })
  login(@Body() bodyRequest: LoginRequest) {
    return this._securityService.login(bodyRequest.username, bodyRequest.password, '');
  }

  @Post('register')
  @ApiBody({
    type: LoginBody,
    description: 'Crea un usuario, inicia sesión con este, y retorna dicha sesión y un token de acceso.'
  })
  @ApiBody({type: RegisterBody})
  register(@Body() bodyRequest: RegisterRequest, @Res() res: Response) {
    return this._securityService.register(bodyRequest)
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

  @Get('logout')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Invalida el token de acceso desde el lado del servidor, y termina la sesión en la base de datos.'
  })
  logout(@Headers() headers) {
    const token = headers['authorization'];
    return this._securityService.logout(token);
  }
}
