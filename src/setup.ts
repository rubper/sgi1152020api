import { config, DotenvParseOutput } from 'dotenv';
import { writeFile } from 'fs/promises';
import { parseBoolean } from 'shared/helpers/functions/parse-boolean.function';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

/**
 * This creates the ormconfig object, and then stringifies it in JSON format
 *
 * @param envConfig - An object containing the environmental variables
 * @returns An string with the ormconfig content
 */
export function buildDatabaseEnvironmentJSON(envConfig: Record<string,string>): string {
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

/**
 * Writes to the file system, the ormconfig generated with the buildDatabaseEnvironmentJSON function
 * 
 * @param envConfig - An object containing the environmental variables
 * @returns A promise that resolves a boolean confirming the success or fail of the operation
 */
export async function writeOrmConfig(envConfig: Record<string,string>): Promise<boolean> {
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

/**
 * Main setup environment process
 *
 * @param {boolean} isProd - Whether the running context is production or not
 * @returns A promise that resolves to the parsed environment variables object
 */
export async function setupEnvironment(isProd: boolean): Promise<DotenvParseOutput> { 
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
    const result = await writeOrmConfig(configOutput.parsed);
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

/**
 * Reads the PRODUCTION environmental variable, and returns it's value as boolean.
 * Default: false
 * 
 * @returns The value of the environmental variable.
 */
export function getProductionFlag(): boolean {
  return parseBoolean(process.env.PRODUCTION || 'false');
}

setupEnvironment(getProductionFlag());