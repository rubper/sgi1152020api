import { Injectable } from '@nestjs/common';
import { PasswordHash } from 'auth/interfaces/password-hash.interface';
import { compare, genSalt, hash } from 'bcrypt';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class SecurityService {
  constructor() {}

  generatePasswordHash(data: string): Observable<PasswordHash> {
    return from(genSalt())
      .pipe(
        switchMap(
          (salt: string) => {
            return combineLatest<[string, string]>([
              of(salt),
              from(hash(data, salt))
            ]);
          }
        ),
        map(
          ([salt, userHash]: [string, string]) => {
            return { 
              salt, 
              hash: userHash 
            };
          }
        )
      );
  }

  verifyPassword(data: string, hash: string): Observable<boolean> {
    return from(compare(data, hash));
  }
}
