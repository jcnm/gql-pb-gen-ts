import { writeFileSync } from 'fs';
import { join } from 'path';
import { isNonNullType, isListType, isScalarType, isObjectType, isEnumType, isInterfaceType, isUnionType } from 'graphql';
/*
  * ProtoGenerator generates protobuf message definitions from GraphQL types.
  * It uses the GraphQLParser to extract type information from the schema
  * and the DirectiveParser to parse custom directives that modify the generated messages.
  * The generated messages are written to a .proto file in the output directory.
  * The typeMapping property maps GraphQL scalar types to their corresponding protobuf types.
  * The generateMessage method generates a protobuf message definition for a given GraphQL type.
  * The resolveType method resolves a GraphQL type to its corresponding protobuf type.
  * The applyTransformations method applies custom transformations to a field line based on the transformType.
  */
export class ProtoGenerator {
    constructor(config, graphQLParser, directiveParser) {
        this.config = config;
        this.graphQLParser = graphQLParser;
        this.directiveParser = directiveParser;
        this.typeMapping = {
            String: 'string',
            Int: 'int32',
            Float: 'float',
            Boolean: 'bool',
            ID: 'string',
            // Add custom scalar mappings as needed
        };
    }
    generate() {
        const types = this.graphQLParser.getTypes();
        const protoMessages = types.map(type => this.generateMessage(type)).join('\n');
        const protoContent = `
syntax = "proto3";

${protoMessages}
`;
        const outputPath = join(this.config.get('outputDir'), 'messages.proto');
        writeFileSync(outputPath, protoContent);
    }
    /**
     *
     * @param type  The GraphQLObjectType to generate a message for
     * @returns   The generated protobuf message definition
     */
    generateMessage(type) {
        const fields = type.getFields();
        const fieldLines = [];
        let fieldNumber = 1;
        for (const [name, field] of Object.entries(fields)) {
            const directives = this.directiveParser.parseFieldDirectives(field);
            if (directives.exclude) {
                continue;
            }
            const fieldType = this.resolveType(field.type);
            if (!fieldType) {
                console.warn(`Type for field ${name} could not be resolved.`);
                continue;
            }
            let line = `  ${fieldType} ${name} = ${fieldNumber};`;
            if (directives.transform) {
                line = this.applyTransformations(line, directives.transform);
            }
            fieldLines.push(line);
            fieldNumber++;
        }
        return `message ${type.name} {\n${fieldLines.join('\n')}\n}\n`;
    }
    resolveType(type) {
        if (isNonNullType(type)) {
            return this.resolveType(type.ofType);
        }
        else if (isListType(type)) {
            const innerType = this.resolveType(type.ofType);
            return innerType ? `repeated ${innerType}` : null;
        }
        else if (isScalarType(type)) {
            return this.typeMapping[type.name] || null;
        }
        else if (isObjectType(type) || isEnumType(type) || isInterfaceType(type) || isUnionType(type)) {
            return type.name;
        }
        else if (type.name === 'Date' || type.name === 'DateTime') {
            return type.name;
        }
        return null;
    }
    applyTransformations(line, transformType) {
        // Implement transformation logic based on the transformType
        // For example, masking or encrypting fields
        return line; // Placeholder for actual implementation
    }
}
