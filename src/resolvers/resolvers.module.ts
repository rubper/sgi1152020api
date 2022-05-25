import { Module } from '@nestjs/common';
import { GraphQLUUID } from 'shared/graphql/scalar-types/uuid.gql-type';
import { GraphQLResolversModule } from './graphql/graphql.module';

@Module({
  imports: [
    GraphQLResolversModule
  ],
  exports: [
    GraphQLResolversModule
  ],
  providers: [
    GraphQLUUID,
  ],
})
export class ResolversModule {}
