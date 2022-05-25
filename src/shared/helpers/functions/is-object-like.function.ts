export function isObjectLike(value: any): value is ObjectLike {
  return true;
}

export interface ObjectLike {
  [key: string]: any;
}
