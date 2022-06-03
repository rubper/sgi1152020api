import { config } from 'dotenv';
import { writeFile } from 'fs/promises';
import { parseBoolean } from 'shared/helpers/functions/parse-boolean.function';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export function buildDatabaseEnvironmentJSON(envConfig: Record<string,string>): string | NodeJS.ArrayBufferView {
  const isProd = parseBoolean(envConfig.PRODUCTION || 'false');
  const sslConfig = isProd ? {
    ssl: {
      rejectUnauthorized: false
    }
  } : undefined;
  const ormConfigObject: PostgresConnectionOptions = {
    type: 'postgres',
    url: envConfig.DATABASE_URL,
    synchronize: parseBoolean(envConfig.PG_SYNCDB),
    logging: parseBoolean(envConfig.LOGGING),
    ssl: isProd ? true : false,
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
    const result = await createOrmConfig(configOutput.parsed);
    if (result) {
      return configOutput.parsed;
    } else {
      return;
    }
  } else {
    console.error(`[ 'AppError' ] Couldn't config environment!`);
    console.error(`[ 'AppError' ] Couldn't create ORM configuration as .env couldn't be loaded!`);
    console.error(`[ 'AppError' ] dotenv Error details:`, configOutput.error);
  }
}

export function getProductionFlag(): boolean {
  return parseBoolean(process.env.PRODUCTION || 'false');
}
