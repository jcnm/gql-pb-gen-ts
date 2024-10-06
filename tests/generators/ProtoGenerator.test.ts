import { writeFileSync } from 'fs';
// tests/generators/ProtoGenerator.test.ts
import { ProtoGenerator } from '../../src/generators/ProtoGenerator';
import { Config } from '../../src/config/Config';
import { GraphQLParser } from '../../src/parsers/GraphQLParser';
import { DirectiveParser } from '../../src/parsers/DirectiveParser';
import { GraphQLSchema, buildSchema } from 'graphql';
import * as fs from 'fs';

jest.mock('fs');

describe('ProtoGenerator', () => {
  const mockSchemaSDL = `
    directive @exclude on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION | ENUM_VALUE | SCALAR | UNION | INTERFACE | ENUM | INPUT_OBJECT | OBJECT 
    directive @transform(type: String) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION | ENUM_VALUE | SCALAR | UNION | INTERFACE | ENUM | INPUT_OBJECT | OBJECT 

    type User {
      id: ID!
      username: String!
      email: String! @exclude
      profile: Profile @transform(type: "mask")
    }

    type Profile {
      bio: String
      age: Int
    }
  `;

  let schema: GraphQLSchema;
  let config: Config;
  let graphQLParser: GraphQLParser;
  let directiveParser: DirectiveParser;
  let protoGenerator: ProtoGenerator;

  beforeEach(() => {
    schema = buildSchema(mockSchemaSDL);
    config = new Config({ outputDir: './generated' });
    graphQLParser = new GraphQLParser(schema);
    directiveParser = new DirectiveParser();
    protoGenerator = new ProtoGenerator(config, graphQLParser, directiveParser);

    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate protobuf messages excluding fields with @exclude', () => {
    protoGenerator.generate();

    const expectedOutput = expect.stringContaining('message User');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expectedOutput
    );

    const writtenContent = (fs.writeFileSync as jest.Mock).mock.calls[0][1];

    expect(writtenContent).toContain('string id = 1;');
    expect(writtenContent).toContain('string username = 2;');
    expect(writtenContent).not.toContain('string email =');
    expect(writtenContent).toContain('Profile profile = 3;');
  });

  it('should apply transformations based on @transform directive', async () => {
    // Mock the `applyTransformations` method with the correct signature
    jest.spyOn(protoGenerator as any, 'applyTransformations').mockImplementation((...args: unknown[]) => {
      return `// transformed\n${args[0]}`;
    });

    await protoGenerator.generate();

    const writtenContent = (fs.writeFileSync as jest.Mock).mock.calls[0][1];
    expect(writtenContent).toContain('// transformed\n');
  });

});
