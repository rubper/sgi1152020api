import {rename, copyFile} from 'fs/promises';
async function setProdEnv() {
  await copyFile('prod.env', 'p.env');
  await rename('p.env', '.env');
}
setProdEnv();
