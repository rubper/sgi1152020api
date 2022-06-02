import { LogoutRequest } from 'auth/interfaces/_logout-request.interface';

export class LogoutBody implements LogoutRequest {
  redirectUrl?: string;
}