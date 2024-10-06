// src/parsers/DirectiveParser.ts

import { DirectiveNode, ValueNode } from 'graphql';
import { ParsedDirectives } from '../types';

export class DirectiveParser {
  parseDirectives(directives: ReadonlyArray<DirectiveNode> | undefined): ParsedDirectives {
    const parsedDirectives: ParsedDirectives = {};

    if (directives) {
      for (const directive of directives) {
        const name = directive.name.value;
        const args = this.getArguments(directive.arguments);

        if (name === 'exclude') {
          parsedDirectives.exclude = true;
        } else if (name === 'secure') {
          parsedDirectives.secure = {
            hash: args.hash as string,
          };
        } else if (name === 'transform') {
          parsedDirectives.transform = {
            type: args.type as string,
            name: args.name as string,
            custom_type: args.custom_type as string,
            repeated: args.repeated === true,
            oneof: args.oneof as string,
            map_key: args.map_key as string,
            map_value: args.map_value as string,
          };
        }
      }
    }

    return parsedDirectives;
  }

  private getArguments(args: ReadonlyArray<any> | undefined): Record<string, any> {
    const argObj: Record<string, any> = {};

    if (args) {
      for (const arg of args) {
        const value = this.parseValueNode(arg.value);
        argObj[arg.name.value] = value;
      }
    }

    return argObj;
  }

  private parseValueNode(valueNode: ValueNode): any {
    switch (valueNode.kind) {
      case 'IntValue':
        return parseInt(valueNode.value, 10);
      case 'FloatValue':
        return parseFloat(valueNode.value);
      case 'StringValue':
      case 'EnumValue':
        return valueNode.value;
      case 'BooleanValue':
        return valueNode.value;
      case 'ListValue':
        return valueNode.values.map((v) => this.parseValueNode(v));
      case 'ObjectValue':
        const obj: Record<string, any> = {};
        for (const field of valueNode.fields) {
          obj[field.name.value] = this.parseValueNode(field.value);
        }
        return obj;
      case 'NullValue':
        return null;
      default:
        return null;
    }
  }
}
