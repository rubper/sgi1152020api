import { Injectable } from '@nestjs/common';

import { compare, genSalt, hash } from 'bcrypt';
import { decode, JwtPayload, sign, SignOptions } from 'jsonwebtoken';
import { catchError, combineLatest, first, from, map,  Observable, of, switchMap, tap, throwError } from 'rxjs';

import { Role } from 'models/role.model';
import { User } from 'models/user.model';

import { Secrets } from 'constants/secrets.constant';

import { UserService } from 'core/services/user.service';

import { LoginResult } from 'auth/interfaces/_login-result.interface';
import { PasswordHash } from 'auth/interfaces/_password-hash.interface';
import { UserSessionService } from 'core/services/user-session.service';
import { Session } from 'models/user-session.model';
import moment from 'moment';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UUID } from 'types/uuid.type';
import { DbFilter } from 'types/_db-filter-params.type';
import { RegisterResult } from 'auth/interfaces/_register-result.interface';
import { ActiveSessionResult } from 'auth/interfaces/_active-session-result.interface';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';
import { UserProfileService } from 'core/services/user-profile.service';
import { CreateUserProfileDTO } from 'DTOs/user-profile.create.dto';
import { UserProfile } from 'models/user-profile.model';
import { SgiResponse } from 'interfaces/_response.interface';
import { AuthErrorFactory, AuthErrors } from 'auth/helpers/auth.errors';
import { IUser } from 'auth/interfaces/user.interface';
import { IUserProfile } from 'interfaces/user-profile.interface';
import { RoleService } from 'core/services/role.service';

@Injectable()
export class SecurityService {
  constructor(
    private _userService: UserService,
    private _roleService: RoleService,
    private _userProfileService: UserProfileService,
    private _userSessionService: UserSessionService,
  ) {}

  /**
   * Generates a hash from a generated salt, and returns both the hash and the salt
   * @param data the data for the hash
   * @returns an observable of a PasswordHash object
   */
  generatePasswordHash(data: string): Observable<PasswordHash> {
    // generate salt
    return from(genSalt())
      .pipe(
        switchMap(
          (salt: string) => {
            // generate hash
            return combineLatest<[string, string]>([
              of(salt),
              from(hash(data, salt))
            ]);
          }
        ),
        map(
          ([salt, userHash]: [string, string]) => {
            // return password hash object
            return { 
              salt, 
              hash: userHash 
            };
          }
        )
      );
  }

  /**
   * compares the password with the stored password hash
   *
   * @param password password to verify
   * @param passwordConfirmation the confirmation of the password
   * @param passwordHash the stored hash of the password
   * @returns an observable confirming whether the password matches the stored hash
   */
  verifyPassword(password: string, passwordHash: string): Observable<boolean> {
    // compare password with saved hash
    return from(compare(password, passwordHash));
  }

  /**
   * Handles login process by verifying the password input against the stored user
   * hash, and if the login is a success, then it generates an Access Token for the current session
   *
   * @param username the username of the user 
   * @param password the password for the login
   * @param honeypot the field that must be empty if a human is logging in
   * @returns an observable with a login result
   */
  login(username: string, password: string, honeypot: string): Observable<LoginResult> {
    // si hay valor en la trampa, parar ejecucion
    if (!!honeypot) {
      return;
    }
    // get user object with username
    return from(this._userService.findByUsername(username))
      .pipe(
        switchMap(
          (user: User) => {
            // step validate if user exists
            if (!user && !user?.uuid) {
              return throwError(
                this.errorFactoryGenerator(
                  AuthErrors.NOTFOUND_ERROR,
                  'user couldn\'t be found'
                )
              );
            }
            return combineLatest([
              of(user),
              this.hasActiveSession(user.uuid)
            ]);
          }
        ),
        map(
          ([user, result]: [User, ActiveSessionResult]) => {
            if (result.hasActiveSession) {                 
              if (result.hasActiveSession) {
                result.activeSessions.forEach(
                  (session: Session) => {
                    session.isActive = false;
                    session.sessionEnd = moment();
                    session.save();
                    session.softRemove();
                    session.save();
                  }
                );
              }
            }
            return user
          }
        ),
        switchMap(
          (user: User) => combineLatest([
            of(user),
            this.verifyPassword(password, user.passwordHash),
          ])
        ),
        switchMap(
          ([user, success]: [User, boolean]) => {
            if (!success) {
              const message = 'password verification failed';
              const loginFailure = new Error(message);
              loginFailure.name = AuthErrors.LOGIN_ERROR;
              return throwError(() => loginFailure)
            }
            const result = this.createLoginResult(user);
            return combineLatest([ 
              from(result),
              of(user),
            ]);
          }
        ),
        switchMap(
          ([result, user]: [LoginResult, User]) => {
            return combineLatest([
              of(result),
              this.createUserSession(result.token, user),
            ]);
          }
        ),
        map(
          ([loginResult, session]: [LoginResult, Session]): LoginResult => {
            const result = loginResult;
            result.session = session;
            return result;
          }
        )
      );
  }
  
  register(registerData: RegisterRequest): Observable<RegisterResult> {
    const password = registerData.password.trim();
    // if password is the same as its confirmation, raise validity flag
    const passwordsMatch$ = of(password === registerData.passwordConfirmation.trim());
    // if username doesnt exists, raise validity flag
    const doesntExist$ = from(
      this._userService.alreadyExists(registerData.username)
      ).pipe(
        map(
          (exists: boolean) => !exists
        ),
        first(),
      );
    // pack checks
    const validityChecks$ = [ doesntExist$, passwordsMatch$ ];
    return combineLatest(validityChecks$)
      .pipe(
        switchMap(
          // step 0: check validity
          (validityChecks: [boolean, boolean]): Observable<PasswordHash>=> {
            const [doesntExist, passwordsMatch] = validityChecks;            
            const invalidRequest = !validityChecks.every((check: boolean) => check);
            if (invalidRequest) {
              let errorFactory:AuthErrorFactory;
                // if password confirmation doesnt match
              if (!passwordsMatch) {
                errorFactory = this.errorFactoryGenerator(
                  AuthErrors.CONFIRMATION_ERROR, 
                  'password confirmation doesn\'t match'
                );
                // if already exists
              } else if (!doesntExist) {
                errorFactory = this.errorFactoryGenerator(
                  AuthErrors.EXISTS_ERROR, 
                  'user already exists'
                );
              }
              return throwError(errorFactory);
            }
            return this.generatePasswordHash(password)
          }
        ),
        switchMap(
          // step 1: create user
          (hashResult: PasswordHash) => {
            const user = new User({
              username: registerData.username,
              passwordHash: hashResult.hash,
              passwordSalt: hashResult.salt,
            });
            return from(user.save());
          }
        ),
        switchMap(
          // step 2: create related profile
          (savedUser: User) => {
            const loginResult$ = from(this.createLoginResult(savedUser));
            const userProfile$ = this.createUserProfile({
              firstName: 'DEMO',
              lastName: 'DEMO',
              user: savedUser.uuid,
              identityDocument: '00000000-0',
            });
            return combineLatest([
              loginResult$,
              userProfile$,
              of(savedUser),
            ])
          }
        ),
        switchMap(
          // step 3: create session
          ([result, profile, user]: [LoginResult, UserProfile, User]) => {
            const userSession$ = this.createUserSession(result.token, user);
            let registerResult: RegisterResult;
            if ( !result.success ) {
              registerResult = result; 
            } else {
              registerResult = {
                ...result,
                createdUser: user,
              };
            }
            return combineLatest([
              userSession$,
              of(registerResult),
              of(profile),
            ]);
          }
        ),
        map(
          // step 4: save created profile in user
          ([session, registerResult, profile]: [Session, RegisterResult, UserProfile]) => {
            const user = User.create(session.user);
            user.profile = profile;
            user.save();
            return registerResult
          }
        ),
      );
  }

  logout(authorizationHeader: string): Observable<boolean> {
    const accessToken = authorizationHeader.split('Bearer ')[1].trim();
    const tokenObject = decode(accessToken) as JwtPayload;
    const userId: UUID = tokenObject.sub;
    return this.revokeToken(userId);
  }

  /**
   * Returns whether the provided authorization header is still valid or not
   *
   * @param authorizationHeader - the auth header with the token
   * @returns a boolean confirming if the token is valid
   */
  async verifyToken(authorizationHeader: string): Promise<boolean> {
    if (!authorizationHeader) {
      return false;
    }
    // get token data
    const accessToken = authorizationHeader.split('Bearer ')[1].trim();
    const tokenObject = decode(accessToken) as JwtPayload;
    
    // Verificacion de app secret en token
 
    // const appid = tokenObject['sgiapp'];    
    // const compareHash = Secrets.APP_HASH;    
    // if (!appid || appid !== compareHash) {
    //   return false;
    // }

    // get dates
    const expDate: number = new Date(tokenObject.exp).getTime();
    const nowDate: number = new Date().getTime() / 1000;
    // compare
    const isValid = nowDate < expDate;
    if (!isValid) {
      const userId = tokenObject.sub;
      this.revokeToken(userId);
    }
    return isValid;
  }

  getUserIdFromToken(token: string) {
    const tokenObject = decode(token) as JwtPayload;
    return tokenObject.sub;
  }

  revokeToken(userId: UUID): Observable<boolean> {
    return this.hasActiveSession(userId)
    .pipe(
      switchMap(
        (result: ActiveSessionResult): Observable<[Session, Session][]> => {     
          let sessions$: Observable<[Session, Session]>[] = [];
          if (result.hasActiveSession) {
            result.activeSessions.forEach(
              (session: Session) => {
                session.isActive = false;
                session.sessionEnd = moment();
                sessions$.push(combineLatest([
                  from(session.save()),
                  from(session.softRemove())
                ]));
              }
            );
            return combineLatest(sessions$);
          }
          return of([]);
        }
      ),
      map(
        (value: [Session, Session][]) => value.every(([saveSession, removeSession]: [Session, Session]) => !saveSession.isActive && !removeSession.isActive)
      )
    );
  }

  hasActiveSession(user: UUID | IUser): Observable<ActiveSessionResult> {
    let user$: Observable<IUser>;
    if (typeof user === 'string') {
      user$ = this._userService.searchUser(user);
    } else {
      user$ = of(user);
    }
    return user$
      .pipe(
        switchMap(
          // get all user sessions
          (userObject: IUser) => {            
            return from(
              this._userSessionService.search({
                'user': { value: userObject.uuid, operator: 'equal' },
                'isActive': { value: true, operator: 'equal' }
              })
            )
          }
        ),
        map(
          (sessions: Session[]) => {
            
            return {
              hasActiveSession: sessions.length !== 0,
              activeSessions: sessions
            };
          }
        )
      )

  }

  /**
   * Connects to the ORM to create a new session in the database
   *
   * @param token - the token to store
   * @param user - the session's user 
   * @returns an observable that emits a created session
   */
   createUserProfile(profileData: CreateUserProfileDTO): Observable<UserProfile> {
    return from(this._userProfileService.create(profileData));
  }

  /**
   * Creates login result object from user data according to the success flag provided
   *
   * @param user - The user info to generate login data 
   * @param success - whether the login was a success or not
   * @returns a login result object
   */
  async createLoginResult(user: User): Promise<LoginResult> {
    const username = user.username;
    // get roles string array
    const userRoles = await this._roleService.getUserRoles(user.uuid);
    const roles = userRoles ? userRoles.map((role: Role) => ({
      id: role.uuid, 
      name: role.name
    })) : [];

    // prepare response
    let token: string;
    let message: string;
    // set up token payload
    const tokenData = {
      roles,
      username,
      sgiapp: Secrets.APP_HASH,
    };
    const tokenConfig: SignOptions = {
      algorithm: 'HS256', 
      subject: user.uuid,
      expiresIn: '7d',
    }; 
    // get token
    token = sign(tokenData, Secrets.PASSWORD, tokenConfig);
    message = 'success';
    return {
      token,
      message,
      success: true,
    }
  }

  /**
   * Connects to the ORM to create a new session in the database
   *
   * @param token - the token to store
   * @param user - the session's user 
   * @returns an observable that emits a created session
   */
  createUserSession(token: string, user: User): Observable<Session> {
    return this.hasActiveSession(user)
      .pipe(
        switchMap(
          (result: ActiveSessionResult) => {
            if(result.hasActiveSession) {
              result.activeSessions.forEach(
                (activeSession: Session) => {
                  this.revokeToken(activeSession.uuid);
                }
              )
            }
            const sessionStart = moment();
            const sessionCreate: CreateDTO<Session> = {
              user,
              token,
              sessionStart,
              isActive: true,
            };
            return from(
              this._userSessionService.create(sessionCreate)
            );

          }
        )
      )
  }

  /**
   * Queries the latest session for the provided user. You can provide an ID, username, user or user observable
   * to this function to perform the search
   *
   * @param user an ID, username, user instance or user observable 
   * @returns the latest session object
   */
  getLatestUserSession(user: Observable<User>): Observable<Session> {
    return user
      .pipe(
        switchMap(
          (userObject: User) => {
            const userFilter: DbFilter<string> = {
              value: userObject.uuid, 
              operator: 'equal' 
            };
            return from (
              this._userSessionService.search(
                // filters
                { 'user': userFilter },
                // order
                { 'sessionStart': 'DESC' }
              )
            )
          }
        ),
        map( (sessions: Session[]) => sessions[0] )
      )
  }

  errorFactoryGenerator(authError: AuthErrors, errorMessage: string): AuthErrorFactory {
    return (): Error => {
      const auxError = new Error(errorMessage);
      auxError.name = authError;
      return auxError;
    }
  }
  
  createLoginErrorResponseObject(err: LoginResult): SgiResponse<Error> {
    let response: SgiResponse;
    const error = err.errorDetail;
    switch (err.errorDetail.name) {
      case AuthErrors.CONFIRMATION_ERROR:
        response = {
          statusCode: 400,
          message: error.message,
          errorMessage: error.name,
          errorDetail: error,
        };
        break;

      case AuthErrors.LOGIN_ERROR:
        response = {
          statusCode: 401,
          message: 'Login failed! Wrong credentials.',
          errorMessage: error.name,
          errorDetail: error,
        };
        break;
    
      case AuthErrors.NOTFOUND_ERROR:
        response = {
          statusCode: 404,
          message: 'User couldn\'t be found, please provide another user.',
          errorMessage: error.name,
          errorDetail: error,
        };
        break;
        
      case AuthErrors.EXISTS_ERROR:
        response = {
          statusCode: 400,
          message: 'That username is already taken.',
          errorMessage: error.name,
          errorDetail: error,
        };
        break;

      default:
        response = {
          statusCode: 500,
          message: err.message,
          errorMessage: error.name,
          errorDetail: error,
        }
        break;
    }
    return response;
  }
}

