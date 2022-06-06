export enum AuthErrors {
  LOGIN_ERROR = 'loginfailure',
  EXISTS_ERROR = 'alreadyexists', 
  NOTFOUND_ERROR = 'usernotfound',
  REGISTER_ERROR = 'registerfailure',
  ADMINCHANGE_ERROR = 'nochangeadmin',
  CONFIRMATION_ERROR = 'passwordnomatch', 
  AUTHREQUIRED_ERROR = 'notauthenticated',
  BASEROLECHANGE_ERROR = 'nochangebaserole',
} 

export type AuthErrorFactory = { (): Error; (): Error; };