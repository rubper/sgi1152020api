import { hash } from 'bcrypt';
import { env } from 'process';

const pwd = env.PASSWORD_SECRET || 'sgi1152022';
const slt = Number(env.APP_SALT) || 10;

export const Secrets = {
  PASSWORD: pwd,
  APP_SALT: slt,
  APP_HASH: ''
}

export async function loadSecrets() {  
  Secrets.APP_HASH = await hash(pwd, slt);
}
