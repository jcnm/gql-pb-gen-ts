// src/parsers/GraphQLParser.ts
import { GraphQLSchema, GraphQLObjectType, isObjectType } from 'graphql';

export class GraphQLParser {
  constructor(private schema: GraphQLSchema) {}

  getTypes() {
    return Object.values(this.schema.getTypeMap()).filter(
      type => isObjectType(type) && !type.name.startsWith('__')
    ) as GraphQLObjectType[];
  }
}
