import { LoginRequest } from 'auth/interfaces/_login-request.interface';

export class LoginBody implements LoginRequest {
  username: string;
  password: string;
}