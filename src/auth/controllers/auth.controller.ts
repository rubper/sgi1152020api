import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LoginRequest } from 'auth/interfaces/_login-request.interface';
import { LogoutRequest } from 'auth/interfaces/_logout-request.interface';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';
import { LoginBody } from 'auth/models/login.body-request';
import { LogoutBody } from 'auth/models/logout.body-request';
import { RegisterBody } from 'auth/models/register.body-request';
import { SecurityService } from 'auth/services/security.service';

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
  register(@Body() bodyRequest: RegisterRequest) {
    return this._securityService.register(bodyRequest);
  }

  @Get('logout')
  @ApiBearerAuth()
  @ApiBody({
    type: LogoutBody,
    description: 'Invalida el token de acceso desde el lado del servidor, y termina la sesión en la base de datos.'
  })
  logout(@Headers() headers) {
    const token = headers['authorization'];
    return this._securityService.logout(token);
  }
}
