import { Body, Controller, Headers, Post } from '@nestjs/common';
import { IUser } from 'auth/interfaces/user.interface';
import { LoginRequest } from 'auth/interfaces/_login-request.interface';
import { LogoutRequest } from 'auth/interfaces/_logout-request.interface';
import { SecurityService } from 'auth/services/security.service';
import { decode, JwtPayload } from 'jsonwebtoken';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _securityService: SecurityService,
  ) {}
  
  @Post('login')
  login(@Body() bodyRequest: LoginRequest) {
    return this._securityService.login(bodyRequest.username, bodyRequest.password, bodyRequest.passwordConfirmation);
  }

  @Post('register')
  register(@Body() bodyRequest: CreateDTO<IUser>) {
    return this._securityService.register(bodyRequest);
  }

  @Post('logout')
  logout(@Headers() headers, @Body() bodyRequest: LogoutRequest) {
    const token = headers['Authorization'];
    const tokenObject = decode(token) as JwtPayload;
    return this._securityService.logout(tokenObject.sub);
  }
}
