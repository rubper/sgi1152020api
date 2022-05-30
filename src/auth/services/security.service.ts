import { Injectable } from '@nestjs/common';

import { compare, genSalt, hash } from 'bcrypt';
import { sign, SignOptions } from 'jsonwebtoken';
import { catchError, combineLatest, from, map,  Observable, of, switchMap, throwError } from 'rxjs';

import { Role } from 'models/role.model';
import { User } from 'models/user.model';

import { Secrets } from 'constants/secrets.constant';
import { Separators } from 'constants/separators.constant';

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

const LOGIN_ERROR = 'loginfailure';

@Injectable()
export class SecurityService {
  constructor(
    private _userService: UserService,
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
   * Validates if the password matches it's confirmation, and if it does, 
   * compares the password with the stored password hash
   *
   * @param password password to verify
   * @param passwordConfirmation the confirmation of the password
   * @param passwordHash the stored hash of the password
   * @returns an observable confirming whether the password matches the stored hash
   */
  verifyPassword(password: string, passwordConfirmation: string, passwordHash: string): Observable<boolean> {
    // return false if confirmation doesnt match password
    if (password !== passwordConfirmation) {
      return of(false);
    }
    // compare password with saved hash
    return from(compare(password, passwordHash));
  }

  /**
   * Handles login process by verifying the password input against the stored user
   * hash, and if the login is a success, then it generates an Access Token for the current session
   *
   * @param username the username of the user 
   * @param password the password for the login
   * @param passwordConfirmation the confirmation of the password
   * @returns an observable with a login result
   */
  login(username: string, password: string, passwordConfirmation: string): Observable<LoginResult> {
    // get user object with username
    const user$ = from(this._userService.findByUsername(username));
    return user$.pipe(
      switchMap(
        (user: User) => combineLatest([
          of(user),
          this.verifyPassword(password, passwordConfirmation, user.passwordHash),
        ])
      ),
      switchMap(
        ([user, success]: [User, boolean]) => {
          const result = this.createLoginResult(user, success);
          if (!result.success) {
            const loginFailure = new Error(result.message);
            loginFailure.name = LOGIN_ERROR;
            return throwError(() => loginFailure)
          }
          return combineLatest([ 
            of(result),
            this.createUserSession(result.token, user)
          ]);
        }
      ),
      catchError(
        (error: Error) => {
          console.error(error);
          const errorResult: LoginResult = {
            success: false,
            message: LOGIN_ERROR
          };
          return of(errorResult);
        }
      ),
      map(
        ([sessionlessResult, session]: [LoginResult, Session]): LoginResult => {
          const result = sessionlessResult;
          result.session = session;
          return result;
        }
      )
    )
  }
  
  register(registerData: RegisterRequest): Observable<RegisterResult> {
    const password = registerData.password.trim();
    if (password !== registerData.passwordConfirmation.trim()) {
      return throwError(() => new Error('password confirmation doesn\'t match'))
    }
    return this.generatePasswordHash(password)
      .pipe(
        switchMap(
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
          (savedUser: User) => {
            const result = this.createLoginResult(savedUser, true);
            return combineLatest([
              this.createUserSession(result.token, savedUser),
              of(result)
            ])
          }
        ),
        catchError(
          (error: Error) => {
            console.error(error);
            const errorResult: LoginResult = {
              success: false,
              message: LOGIN_ERROR
            };
            return of(errorResult);
          }
        ),
        map(
          ([session, sessionlessResult]: [Session, LoginResult]): RegisterResult => {
            let registerResult: RegisterResult;
            if ( !sessionlessResult.success ) {
              registerResult = sessionlessResult; 
            } else {
              registerResult = {
                ...sessionlessResult,
                createdUser: session.user,
              };
            }
            return registerResult;
          }
        )
      );
  }

  logout(userId: UUID): Observable<boolean> {
    const user$ = this._userService.searchUser(userId);
    return this.getLatestUserSession(user$)
      .pipe(
        switchMap(
          (session: Session) => {
            return this.revokeToken(session);
          }
        )
      )
  }

  revokeToken(session: Session): Observable<boolean> {
    session.isActive = false;
    session.sessionEnd = moment();
    session.save();
    session.softRemove();
    return this.hasActiveSession(session.user)
      .pipe(
        map(
          (result: ActiveSessionResult) => !result.hasActiveSession
        )
      );
  } 

  hasActiveSession(user: UUID | User): Observable<ActiveSessionResult> {
    let user$: Observable<User>;
    if (typeof user === 'string') {
      user$ = this._userService.searchUser(user);
    } else {
      user$ = of(user);
    }
    return user$
      .pipe(
        switchMap(
          // get all user sessions
          (userObject: User) => from(
            this._userSessionService.search({
              'user': { value: userObject },
              'isActive': { value: true }
            })
          )
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
   * Creates login result object from user data according to the success flag provided
   *
   * @param user - The user info to generate login data 
   * @param success - whether the login was a success or not
   * @returns a login result object
   */
  createLoginResult(user: User, success: boolean): LoginResult {
    const username = user.username;
    // get roles string array
    const roles = user.roles.map((role: Role) => ({
      id: role.uuid, 
      name: role.name
    }));

    // prepare response
    let token: string;
    let message: string;
    if (success) {
      // set up token payload
      const tokenData = {
        roles,
        username,
      };
      const tokenConfig: SignOptions = {
        algorithm: 'HS256', 
        subject: user.uuid,
        expiresIn: '7d',
      }; 
      // get token
      token = sign(tokenData, Secrets.PASSWORD, tokenConfig);
      message = 'success';
    } else {
      message = 'password verification failed';
    }
    return {
      token,
      success,
      message,
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
                  this.revokeToken(activeSession);
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
            const userFilter: DbFilter<User> = {
              value: userObject
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
        map(
          (sessions: Session[]) => sessions[0]
        )
      )
  }
}

