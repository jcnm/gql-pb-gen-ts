// src/parsers/DirectiveParser.ts
export class DirectiveParser {
    parseDirectives(directives) {
        const parsedDirectives = {};
        if (directives) {
            for (const directive of directives) {
                const name = directive.name.value;
                const args = this.getArguments(directive.arguments);
                if (name === 'exclude') {
                    parsedDirectives.exclude = true;
                }
                else if (name === 'secure') {
                    parsedDirectives.secure = {
                        hash: args.hash,
                    };
                }
                else if (name === 'transform') {
                    parsedDirectives.transform = {
                        type: args.type,
                        custom_type: args.custom_type,
                        repeated: args.repeated === true,
                        oneof: args.oneof,
                        map_key: args.map_key,
                        map_value: args.map_value,
                    };
                }
            }
        }
        return parsedDirectives;
    }
    getArguments(args) {
        const argObj = {};
        if (args) {
            for (const arg of args) {
                const value = this.parseValueNode(arg.value);
                argObj[arg.name.value] = value;
            }
        }
        return argObj;
    }
    parseValueNode(valueNode) {
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
                const obj = {};
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
