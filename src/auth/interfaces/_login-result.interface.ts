import { Session } from 'models/user-session.model';

export interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
  session?: Session;
}
