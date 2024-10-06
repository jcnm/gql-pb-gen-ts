// tests/parsers/GraphQLParser.test.ts
import { GraphQLParser } from '../../src/parsers/GraphQLParser';
import { buildSchema, GraphQLObjectType } from 'graphql';

describe('GraphQLParser', () => {
  it('should retrieve object types from schema', () => {
    const schemaSDL = `
      type Query {
        hello: String
      }

      type User {
        id: ID!
        name: String!
      }

      scalar Date
    `;
    const schema = buildSchema(schemaSDL);
    const parser = new GraphQLParser(schema);

    const types = parser.getTypes();

    expect(types).toHaveLength(2);
    const typeNames = types.map(type => type.name);
    expect(typeNames).toContain('Query');
    expect(typeNames).toContain('User');
    expect(typeNames).not.toContain('Date');
  });
});
