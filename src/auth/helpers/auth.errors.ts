export enum AuthErrors {
  LOGIN_ERROR = 'loginfailure',
  EXISTS_ERROR = 'alreadyexists', 
  NOTFOUND_ERROR = 'usernotfound',
  REGISTER_ERROR = 'registerfailure',
  CONFIRMATION_ERROR = 'passwordnomatch', 
} 

export type AuthErrorFactory = { (): Error; (): Error; };