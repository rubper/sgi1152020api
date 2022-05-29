export interface JWTSkeleton {
  alg: string;
  typ: string;

  sub: string;
  name: string;
  iat: number;

  roles: string;
}
