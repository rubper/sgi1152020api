import { DevEnvironment } from 'constants/dev-environment.constant';
import { writeFile } from 'fs/promises';
import { parseBoolean } from 'shared/helpers/functions/parse-boolean.function';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

/**
 * This creates the ormconfig object, and then stringifies it in JSON format
 *
 * @returns An string with the ormconfig content
 */
export function buildDatabaseEnvironmentJSON(): string {
  const isProd = parseBoolean(process.env.PRODUCTION|| 'false');
  const sslConfig = isProd ? {
    ssl: {
      rejectUnauthorized: false
    }
  } : undefined;
  const dbUrl = process.env.DATABASE_URL === 'undefined' ? undefined : process.env.DATABASE_URL;
  const url = dbUrl || DevEnvironment.DATABASE_URL;
  const ormConfigObject: PostgresConnectionOptions = {
    url,
    type: 'postgres',
    synchronize: parseBoolean(process.env.PG_SYNCDB),
    logging: parseBoolean(process.env.LOGGING),
    ssl: isProd,
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
 * Main setup environment process
 * Writes to the file system, the ormconfig generated with the buildDatabaseEnvironmentJSON function
 * 
 * @returns A promise that resolves a boolean confirming the success or fail of the operation
 */
export async function writeOrmConfig(): Promise<boolean> {
  // set up database from environment
  try {
    await writeFile(
      'ormconfig.json', 
      buildDatabaseEnvironmentJSON()
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

writeOrmConfig();