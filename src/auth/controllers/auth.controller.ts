import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IUser } from 'auth/interfaces/user.interface';
import { LoginRequest } from 'auth/interfaces/_login-request.interface';
import { LogoutRequest } from 'auth/interfaces/_logout-request.interface';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';
import { SecurityService } from 'auth/services/security.service';
import { decode, JwtPayload } from 'jsonwebtoken';

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
  register(@Body() bodyRequest: RegisterRequest) {
    return this._securityService.register(bodyRequest);
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(@Headers() headers, @Body() bodyRequest: LogoutRequest) {
    const token = headers['authorization'];
    return this._securityService.logout(token);
  }
}
