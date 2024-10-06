
// tests/generators/ProtoGenerator.test.ts
import { ProtoGenerator } from '../../src/generators/ProtoGenerator';
import { Config } from '../../src/config/Config';
import { GraphQLParser } from '../../src/parsers/GraphQLParser';
import { DirectiveParser } from '../../src/parsers/DirectiveParser';
import { ObjectTypeDefinitionNode, EnumTypeDefinitionNode } from 'graphql';
import 'jest';

jest.mock('../../src/parsers/GraphQLParser');
jest.mock('../../src/parsers/DirectiveParser');

describe('ProtoGenerator', () => {
  let protoGenerator: ProtoGenerator;
  let mockConfig: Config;
  let mockGraphQLParser: GraphQLParser;
  let mockDirectiveParser: DirectiveParser;

  beforeEach(() => {
    mockConfig = new Config();
    mockGraphQLParser = new GraphQLParser({} as any);
    mockDirectiveParser = new DirectiveParser();

    protoGenerator = new ProtoGenerator(mockConfig, mockGraphQLParser, mockDirectiveParser);
  });

  test('should generate protobuf messages from object types', async () => {
    jest.spyOn(mockGraphQLParser, 'getObjectTypes').mockReturnValue([
      { name: { value: 'TestObject' }, fields: [] } as ObjectTypeDefinitionNode,
    ]);

    const result = await protoGenerator.generate(false);
    expect(result).toContain('message TestObject');
  });

  test('should generate enums from enum types', async () => {
    jest.spyOn(mockGraphQLParser, 'getEnumTypes').mockReturnValue([
      { name: { value: 'TestEnum' }, values: [{ name: { value: 'VALUE1' } }] } as EnumTypeDefinitionNode,
    ]);

    const result = await protoGenerator.generate(false);
    expect(result).toContain('enum TestEnum');
  });

  test('should not generate messages for excluded types', async () => {
    jest.spyOn(mockGraphQLParser, 'getObjectTypes').mockReturnValue([
      { name: { value: 'TestObject' }, fields: [], directives: [{ name: { value: 'exclude' } }] } as ObjectTypeDefinitionNode,
    ]);
    jest.spyOn(mockDirectiveParser, 'parseDirectives').mockReturnValue({ exclude: true });

    const result = await protoGenerator.generate(false);
    expect(result).not.toContain('message TestObject');
  });

  test('should apply field transformations', async () => {
    jest.spyOn(mockGraphQLParser, 'getObjectTypes').mockReturnValue([
      {
        name: { value: 'TestObject' },
        fields: [{ name: { value: 'field' }, type: { kind: 'NamedType', name: { value: 'String' } } }],
      } as ObjectTypeDefinitionNode,
    ]);
    jest.spyOn(mockDirectiveParser, 'parseDirectives').mockReturnValue({ transform: { type: 'int32' } });

    const result = await protoGenerator.generate(false);
    expect(result).toContain('int32 field = 1;');
  });

  test('should handle repeated fields', async () => {
    jest.spyOn(mockGraphQLParser, 'getObjectTypes').mockReturnValue([
      {
        name: { value: 'TestObject' },
        fields: [{ name: { value: 'field' }, type: { kind: 'ListType', type: { kind: 'NamedType', name: { value: 'String' } } } }],
      } as ObjectTypeDefinitionNode,
    ]);

    const result = await protoGenerator.generate(false);
    expect(result).toContain('repeated string field = 1;');
  });

  test('should secure fields with comments', async () => {
    jest.spyOn(mockGraphQLParser, 'getObjectTypes').mockReturnValue([
      {
        name: { value: 'TestObject' },
        fields: [{ name: { value: 'field' }, type: { kind: 'NamedType', name: { value: 'String' } } }],
      } as ObjectTypeDefinitionNode,
    ]);
    jest.spyOn(mockDirectiveParser, 'parseDirectives').mockReturnValue({ secure: { hash: 'SHA256' } });

    const result = await protoGenerator.generate(false);
    expect(result).toContain('// Field is secured with hash: SHA256');
  });

  test('should handle oneof group fields', async () => {
    jest.spyOn(mockGraphQLParser, 'getObjectTypes').mockReturnValue([
      {
        name: { value: 'TestObject' },
        fields: [{ name: { value: 'field' }, type: { kind: 'NamedType', name: { value: 'String' } } }],
      } as ObjectTypeDefinitionNode,
    ]);
    jest.spyOn(mockDirectiveParser, 'parseDirectives').mockReturnValue({ transform: { oneof: 'group1' } });

    const result = await protoGenerator.generate(false);
    expect(result).toContain('oneof group1');
  });

  test('should resolve non-null types correctly', () => {
    const result = protoGenerator['resolveType']({ kind: 'NonNullType', type: { kind: 'NamedType', name: { value: 'String' } } });
    expect(result).toEqual({ type: 'string', repeated: false });
  });

  test('should map custom scalar types', () => {
    protoGenerator['typeMapping'] = { CustomScalar: 'custom' };
    const result = protoGenerator['resolveType']({ kind: 'NamedType', name: { value: 'CustomScalar' } });
    expect(result).toEqual({ type: 'custom', repeated: false });
  });

  test('should return null for unrecognized type nodes', () => {
    const result = protoGenerator['resolveType']({ kind: 'InvalidType' } as any);
    expect(result).toBeNull();
  });
});
