import { Module } from '@nestjs/common';
import { GraphQLUUID } from 'shared/graphql/scalar-types/uuid.gql-type';

@Module({
  exports: [
  ],
  providers: [
    GraphQLUUID,
  ],
})
export class GraphQLResolversModule {}
