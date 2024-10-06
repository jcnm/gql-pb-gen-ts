import { GraphQLParser } from '../../src/parsers/GraphQLParser';
import { parse } from 'graphql';

describe('GraphQLParser', () => {
  test('should extract object types from schema', () => {
    const schema = parse(`
      type Query {
        test: String
      }
      
      type TestObject {
        id: ID
      }
    `);
    
    const parser = new GraphQLParser(schema);
    const objectTypes = parser.getObjectTypes();

    expect(objectTypes.length).toBe(1);
    expect(objectTypes[0].name.value).toBe('TestObject');
  });

  test('should extract enum types from schema', () => {
    const schema = parse(`
      enum TestEnum {
        VALUE1
        VALUE2
      }
    `);

    const parser = new GraphQLParser(schema);
    const enumTypes = parser.getEnumTypes();

    expect(enumTypes.length).toBe(1);
    expect(enumTypes[0].name.value).toBe('TestEnum');
  });
});
