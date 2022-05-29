import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { join } from 'path';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ResolversModule } from './resolvers/resolvers.module';

import { ControllersModule } from 'controllers/controllers.module';
import { writeFile } from 'fs';

export const graphQlModuleOptions: GqlModuleOptions = {
  driver: ApolloDriver,
  include: [ResolversModule],
  autoSchemaFile: join(process.cwd(), 'src/shared/graphql/schema.gql'),
  sortSchema: true,
};

@Module({
  imports: [
    CoreModule, 
    SharedModule,
    ResolversModule,
    ControllersModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: Boolean(process.env.PRODUCTION) ? '.env' : 'dev.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private _configService: ConfigService,
  ) {
    writeFile(
      'ormconfig.json', 
      this.buildDatabaseEnvironmentJSON(),
      (fileErr) => {
        if(fileErr) {
          console.error(fileErr);
        } else {
          console.info('ORMConfig file generated successfuly.');
        }
      }
    );
  }

  buildDatabaseEnvironmentJSON(): string {
    const ormConfigObject = {
      type: 'postgres',
      host: this._configService.get('PG_HOST'),
      port: this._configService.get('PG_PORT'),
      username: this._configService.get('PG_USER'),
      password: this._configService.get('PG_PASS'),
      database: this._configService.get('PG_DB'),
      synchronize: this._configService.get('PG_SYNCDB'),
      logging: this._configService.get('LOGGING'),
      entities: [
          'dist/models/*.model.js'
      ],
      migrations: [
          'dist/migrations/*.js'
      ],
      subscribers: [
          'dist/subscribers/*.subscriber.js'
      ],
      cli: {
          entitiesDir: 'src/models',
          migrationsDir: 'src/migrations',
          subscribersDir: 'src/subscribers'
      }
    }
    return JSON.stringify(ormConfigObject);
  }
}
