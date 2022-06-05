import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _securityService: SecurityService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this._securityService.verifyToken(request.headerField);
  }
}