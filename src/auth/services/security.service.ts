import { Injectable } from '@nestjs/common';

import { compare, genSalt, hash } from 'bcrypt';
import { sign, SignOptions } from 'jsonwebtoken';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';

import { Role } from 'models/role.model';
import { User } from 'models/user.model';

import { Secrets } from 'constants/secrets.constant';
import { Separators } from 'constants/separators.constant';

import { UserService } from 'core/services/user.service';

import { LoginResult } from 'auth/interfaces/_login-result.interface';
import { PasswordHash } from 'auth/interfaces/_password-hash.interface';

@Injectable()
export class SecurityService {
  constructor(
    private _userService: UserService,
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
      map(([user, success]: [User, boolean]): LoginResult => {
        // get roles string
        const rolesArray = user.roles.map((role: Role, index: number) => {
          if (index !== user.roles.length - 1) {
            return `${role.name}${Separators.DATA}`;
          }
          return role.name;
        });
        const roles = ''.concat(...rolesArray);

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
          message = 'login error';
        }
        // return login response
        return {
          token,
          success,
          message,
        }
      })
    )
  }
}

