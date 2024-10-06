import { DirectiveParser } from '../../src/parsers/DirectiveParser';
import { DirectiveNode } from 'graphql';

describe('DirectiveParser', () => {
  let directiveParser: DirectiveParser;

  beforeEach(() => {
    directiveParser = new DirectiveParser();
  });

  test('should parse exclude directive', () => {
    const directives: ReadonlyArray<DirectiveNode> = [{ name: { value: 'exclude' } } as DirectiveNode];
    const result = directiveParser.parseDirectives(directives);

    expect(result).toEqual({ exclude: true });
  });

  test('should parse secure directive with hash', () => {
    const directives: ReadonlyArray<DirectiveNode> = [{
      name: { value: 'secure' },
      arguments: [{ name: { value: 'hash' }, value: { kind: 'StringValue', value: 'SHA256' } }]
    } as DirectiveNode];
    
    const result = directiveParser.parseDirectives(directives);
    
    expect(result).toEqual({ secure: { hash: 'SHA256' } });
  });
});
