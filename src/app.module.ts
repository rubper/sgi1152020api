import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { join } from 'path';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ResolversModule } from './resolvers/resolvers.module';

import { ControllersModule } from 'controllers/controllers.module';

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
      envFilePath: '.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
