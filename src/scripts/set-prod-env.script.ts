import {writeFile} from 'fs/promises';

function generateEnvironmentObject(): Record<string, string> {
  return {
    PRODUCTION: process.env.PRODUCTION,
    PASSWORD_SECRET: process.env.PASSWORD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    PG_HOST: process.env.PG_HOST,
    PG_PORT: process.env.PG_PORT,
    PG_USER: process.env.PG_USER,
    PG_PASS: process.env.PG_PASS,
    PG_DB: process.env.PG_DB,
    PG_SYNCDB: process.env.PG_SYNCDB,
    LOGGING: process.env.LOGGING,
  }
}

function generateEnvOutputString(env: Record<string, string>) {
  const keys = Object.keys(env);
  let output: string = '';
  keys.forEach(
    (key: string) => {
      output = output + key + '=' + env[key] + '\n';
    }
  )
  return output;
}

async function setProdEnv() {
  try {
    const envObject = generateEnvironmentObject();
    const outputString = generateEnvOutputString(envObject);
    console.log('generating .env file...')
    await writeFile('.env', outputString);
    console.log('.env file generated successfully')
  } catch (error) {
    console.error('error writing .env'); 
    console.error(error); 
    
  }
}
setProdEnv();
