// src/parsers/DirectiveParser.ts
import { GraphQLField, GraphQLInputField } from 'graphql';

export interface ParsedDirectives {
  exclude?: boolean;
  transform?: string;
  [key: string]: any;
}

export class DirectiveParser {
  parseFieldDirectives(field: GraphQLField<any, any> | GraphQLInputField): ParsedDirectives {
    const directives: ParsedDirectives = {};
    const astNode = field.astNode;
    if (astNode && astNode.directives) {
      for (const directive of astNode.directives) {
        const name = directive.name.value;
        if (name === 'exclude') {
          directives.exclude = true;
        } else if (name === 'transform') {
          directives.transform = this.getArgumentValue(directive, 'type');
        }
        // Handle other directives as needed
      }
    }
    return directives;
  }

  private getArgumentValue(directive: any, argName: string): string | undefined {
    const arg = directive.arguments.find((arg: any) => arg.name.value === argName);
    return arg?.value?.value;
  }
}
