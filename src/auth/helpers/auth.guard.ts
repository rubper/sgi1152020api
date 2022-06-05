import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';
import { AuthErrors } from './auth.errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _securityService: SecurityService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headerField = request.headerField;
    console.log(headerField);
    
    return this._securityService
      .verifyToken(headerField)
      .then(
        (isValid: boolean) => {
          if (!isValid) {
            throw new HttpException(AuthErrors.AUTHREQUIRED_ERROR, 401);
          }
          return isValid;
        }
      );
  }
}