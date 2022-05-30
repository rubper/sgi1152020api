import { config } from 'dotenv';
import { writeFile } from 'fs/promises';
import { ConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export function buildDatabaseEnvironmentJSON(envConfig: Record<string,string>): string | NodeJS.ArrayBufferView {
  const sslConfig = evaluateLiteralFlag(envConfig.PRODUCTION) ? {
    ssl: {
      rejectUnauthorized: false
    }
  } : undefined;
  const ormConfigObject: PostgresConnectionOptions = {
    type: 'postgres',
    url: envConfig.DATABASE_URL,
    synchronize: evaluateLiteralFlag(envConfig.PG_SYNCDB),
    logging: evaluateLiteralFlag(envConfig.LOGGING),
    ssl: evaluateLiteralFlag(envConfig.PRODUCTION) ? true : false,
    schema: 'public',
    entities: [
        'dist/src/models/*.model.js'
    ],
    migrations: [
        'dist/src/migrations/*.js'
    ],
    subscribers: [
        'dist/src/subscribers/*.subscriber.js'
    ],
    cli: {
        entitiesDir: 'src/models',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
    },
    extra: sslConfig
  }
  return JSON.stringify(ormConfigObject);
}

export async function createOrmConfig(envConfig: Record<string,string>): Promise<boolean> {
  // set up database from environment
  try {
    await writeFile(
      'ormconfig.json', 
      buildDatabaseEnvironmentJSON(envConfig)
    );
    console.info(`[ 'AppInfo' ] ORMConfig file generated successfuly.`);
    return true;
  } catch (error) {
    console.error(`[ 'AppError' ] Error while creating ORM configuration file`);
    console.error(`[ 'AppError' ] ormconfig Error details:`);
    console.error(error);
    return false;
  }
}

export async function setupEnvironment(isProd: boolean): Promise< Record<string,string> | undefined > { 
  // config dotenv
  const configOutput = config({
    path: isProd ? '.env' : 'dev.env'
  });

  // handle output
  if (!configOutput.error) {
    // success
    console.info(`[ 'AppInfo' ] DotEnv configurated`);

    if (isProd) {
      // warn production mode
      console.warn(`[ 'AppWarning' ] Running in production mode!`);
    }
  
    // set up orm config
    await createOrmConfig(configOutput.parsed);
    return configOutput.parsed;
  } else {
    console.error(`[ 'AppError' ] Couldn't config environment!`);
    console.error(`[ 'AppError' ] Couldn't create ORM configuration as .env couldn't be loaded!`);
    console.error(`[ 'AppError' ] dotenv Error details:`, configOutput.error);
  }
}

export function getProductionFlag(): boolean {
  return evaluateLiteralFlag(process.env.PRODUCTION);
}

export function evaluateLiteralFlag(flag: string) {
  const trimmedVar = flag.trim();
  if (trimmedVar === 'true') {
    return true;
  } else if (trimmedVar === 'false') {
    return false;
  } else if (trimmedVar.length === 0) {
    return undefined;
  } else {
    throw new Error('Invalid value, please provide a boolean value for flag');
  }

}
