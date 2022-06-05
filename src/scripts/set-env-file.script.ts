import { DevEnvironment } from 'constants/dev-environment.constant';
import { config } from 'dotenv';
import {writeFile} from 'fs/promises';
import { parseBoolean } from 'shared/helpers/functions/parse-boolean.function';

function configDotenv(isProd: boolean): boolean {
  console.info(`[ 'AppInfo' ] Configuring DotEnv...`);
  const dotenvPath = isProd ? '.env' : 'dev.env';
  // config dotenv
  const configOutput = config({
    path: dotenvPath
  });

  // handle output
  if (!configOutput.error) {
    // success
    console.info(`[ 'AppInfo' ] DotEnv configurated`);

    if (isProd) {
      // warn production mode
      console.warn(`[ 'AppWarning' ] Running in production mode!`);
    }
    return true;
  } else {
    console.error(`[ 'AppError' ] Couldn't config environment!`);
    console.error(`[ 'AppError' ] Couldn't create ORM configuration as .env couldn't be loaded!`);
    console.error(`[ 'AppError' ] dotenv Error details:`, configOutput.error);
    throw new Error(`Couldn't configure dotenv with ${dotenvPath} file`);
  }
}

function generateEnvironmentObject(): Record<string, string> {
  return {
    PRODUCTION: process.env.PRODUCTION || 'false',
    DATABASE_URL: process.env.DATABASE_URL || DevEnvironment.DATABASE_URL,
    APP_SALT: process.env.APP_SALT || DevEnvironment.APP_SALT,
    PASSWORD_SECRET: process.env.PASSWORD_SECRET || DevEnvironment.PASSWORD_SECRET,
    PG_SYNCDB: process.env.PG_SYNCDB || DevEnvironment.PG_SYNCDB,
    LOGGING: process.env.LOGGING || DevEnvironment.LOGGING,
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

/**
 * Reads the PRODUCTION environmental variable, and returns it's value as boolean.
 * Default: false
 * 
 * @returns The value of the environmental variable.
 */
export function getProductionFlag(): boolean {
  return parseBoolean(process.env.PRODUCTION || 'false');
}

async function setEnvFile() {
  try {
    const isProd = getProductionFlag();
    const filename = isProd ? '.env' : 'dev.env';
    const envObject = generateEnvironmentObject();
    const outputString = generateEnvOutputString(envObject);
    console.log(`[ 'AppInfo' ] generating ${filename} file...`)
    await writeFile(filename, outputString);
    console.log(`[ 'AppInfo' ] ${filename} file generated successfully`)
    configDotenv(isProd);
  } catch (error) {
    console.error(`[ 'AppError' ] error writing dotenv file`); 
    console.error(error); 
  }
}
setEnvFile();
