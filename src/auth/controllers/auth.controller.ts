import { Body, Controller, Headers, Post } from '@nestjs/common';
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
  @ApiBody({type: LoginBody})
  login(@Body() bodyRequest: LoginRequest) {
    return this._securityService.login(bodyRequest.username, bodyRequest.password, '');
  }

  @Post('register')
  @ApiBody({type: RegisterBody})
  register(@Body() bodyRequest: RegisterRequest) {
    return this._securityService.register(bodyRequest);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiBody({type: LogoutBody})
  logout(@Headers() headers, @Body() bodyRequest: LogoutRequest) {
    const token = headers['authorization'];
    return this._securityService.logout(token);
  }
}
