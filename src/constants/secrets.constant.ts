import { env } from 'process';
export const Secrets = {
  PASSWORD: env.PASSWORD_SECRET || 'sgi1152022',
}
