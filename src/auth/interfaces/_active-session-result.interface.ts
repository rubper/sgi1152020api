import { Session } from 'models/user-session.model';

export interface ActiveSessionResult {
  hasActiveSession: boolean;
  activeSessions: Session[]
}