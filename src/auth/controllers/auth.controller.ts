import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { LoginBody } from 'auth/models/login.body-request';
import { SgiResponse } from 'interfaces/_response.interface';
import { SecurityService } from 'auth/services/security.service';
import { RegisterBody } from 'auth/models/register.body-request';
import { LoginRequest } from 'auth/interfaces/_login-request.interface';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';
import { LoginResult } from 'auth/interfaces/_login-result.interface';
import { RegisterResult } from 'auth/interfaces/_register-result.interface';

@Controller('auth')
@ApiTags('Autenticación')
export class AuthController {
  constructor(
    private readonly _securityService: SecurityService,
  ) {}
  
  @Post('login')
  @ApiBody({
    type: LoginBody,
    description: 'Retorna un resultado de inicio de sesión, con una bandera de exito, un mensaje, ' +
    'y en caso de exito un token de acceso. Aparte del nombre de usuario y contraseña, debe recibir ' +
    'un tercer paramentro que debe ir vacío para atrapar bots indeseados. (deshabilitado por el momento).'
  })
  login(@Body() bodyRequest: LoginRequest, @Res() res: Response) {
    return this._securityService
      .login(bodyRequest.username, bodyRequest.password, '')
      .pipe(
        catchError(
          (loginError): Observable<LoginResult> => {
            console.log(loginError);
            
            const result: LoginResult = {
              success: false,
              message: 'error while trying to login',
              errorDetail: loginError,
            }
            return of(result);
          }
        ),
        map(
          (result: LoginResult) => {
            if (result.errorDetail) {
              const response = this._securityService.createLoginErrorResponseObject(result);
              return res.status(response.statusCode).send(response);
            }
            const response: SgiResponse<LoginResult> = {
              statusCode: 200,
              message: result.message,
              data: result,
            }
            return res.status(response.statusCode).json(response);
          }
        ),
      );
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
          (loginError): Observable<RegisterResult> => {
            console.log(loginError);
            
            const result: LoginResult = {
              success: false,
              message: 'error while trying to register',
              errorDetail: loginError,
            }
            return of(result);
          }
        ),
        map(
          (result: RegisterResult) => {
            if (result.errorDetail) {
              const response = this._securityService.createLoginErrorResponseObject(result);
              return res.status(response.statusCode).send(response);
            }
            const response: SgiResponse = {
              statusCode: 201,
              message: result.message,
              data: result
            }
            return res.status(201).json(response)
          }
        ),
      );
  }

  @Get('logout')
  @ApiBearerAuth('JWT')
  @ApiResponse({
    description: 'Invalida el token de acceso desde el lado del servidor, y termina la sesión en la base de datos.'
  })
  logout(@Headers() headers: {authorization: string}) {
    const token = headers.authorization;
    
    if (!token) {
      return false;
    }

    return this._securityService.logout(token);
  }

  @Get('validate-token')
  @ApiBearerAuth('JWT')
  @ApiResponse({
    description: 'Verifica si el token de autorizacion es valido o no.'
  })
  verifyToken(@Headers() headers: {authorization: string}) {
    const token = headers.authorization;
    
    if (!token) {
      return false;
    }
    return this._securityService.verifyToken(token);
  }
}
