// tests/parsers/DirectiveParser.test.ts
import { DirectiveParser } from '../../src/parsers/DirectiveParser';
import { parse, buildSchema, GraphQLField } from 'graphql';

describe('DirectiveParser', () => {
  it('should parse directives on a field', () => {
    const schemaSDL = `
      directive @exclude on FIELD_DEFINITION
      directive @transform(type: String) on FIELD_DEFINITION

      type User {
        id: ID!
        email: String! @exclude
        profile: Profile @transform(type: "mask")
      }

      type Profile {
        bio: String
      }
    `;
    const schema = buildSchema(schemaSDL);
    const userType = schema.getType('User');
    const fields = (userType as any).getFields() as Record<string, GraphQLField<any, any>>;
    const directiveParser = new DirectiveParser();

    const emailDirectives = directiveParser.parseFieldDirectives(fields.email);
    expect(emailDirectives.exclude).toBe(true);

    const profileDirectives = directiveParser.parseFieldDirectives(fields.profile);
    expect(profileDirectives.transform).toBe('mask');

    const idDirectives = directiveParser.parseFieldDirectives(fields.id);
    expect(idDirectives).toEqual({});
  });
});
