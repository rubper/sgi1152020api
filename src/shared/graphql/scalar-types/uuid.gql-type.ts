import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLScalarValueParser, GraphQLScalarSerializer, GraphQLScalarLiteralParser, GraphQLError, Kind, ValueNode } from 'graphql';
import { isUUIDValid } from 'shared/helpers/functions/is-uuid-valid.function';
import { serializeObject } from 'shared/helpers/functions/serialize-object.function';
import { UUID } from 'types/uuid.type';

@Scalar('UUID')
export class GraphQLUUID implements CustomScalar<string, UUID> {
  name: string = 'UUID';
  description?: string = 'The `UUID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The UUID type is a 128-bit label, when it\'s generated according to the standard methods, UUID\'s are, for practical purposes, unique.';
  
  parseValue: GraphQLScalarValueParser<UUID> = (inputValue: string): UUID => {
    if (typeof inputValue !== 'string' || !isUUIDValid(inputValue)) {
      throw new GraphQLError(
        `Invalid input for UUID type: ${inputValue}`,
        {}
      );
    }

    return inputValue;
  };
  
  serialize: GraphQLScalarSerializer<UUID> = (outputValue): string => {
    const coercedValue = serializeObject(outputValue); // Serialize string, boolean and number values to a string, but do not
    // attempt to coerce object, function, symbol, or other types as strings.

    if (typeof coercedValue === 'string') {
      return coercedValue;
    }

    if (typeof coercedValue === 'boolean') {
      return coercedValue ? 'true' : 'false';
    }

    if (typeof coercedValue === 'number' && Number.isFinite(coercedValue)) {
      return coercedValue.toString();
    }

    throw new GraphQLError(
      `UUID cannot represent value: ${outputValue}`,
      {}
    );
  };
  
  parseLiteral: GraphQLScalarLiteralParser<UUID> = (valueNode: ValueNode): UUID => {
    if (valueNode.kind !== Kind.STRING ) {
      throw new GraphQLError(
        `UUID cannot represent a non string value: ${valueNode}`,
        {nodes: valueNode},
      );
    }
    if (!isUUIDValid(valueNode.value)) {
      throw new GraphQLError(
        `Invalid input for UUID, with value: ${valueNode}`,
        {nodes: valueNode},
      );
    }

    return valueNode.value;
  };

}

