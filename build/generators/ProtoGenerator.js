import { join } from 'path';
import { ProtoField } from './../protobuf/ProtoField.js';
import { ProtoMessage } from './../protobuf/ProtoMessage.js';
import { generateProtobufFile } from '../utils/TemplateProcessor.js';
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
        // private typeMapping: Record<string, string> = {
        //   String: 'string',
        //   Int: 'int32',
        //   Float: 'float',
        //   Boolean: 'bool',
        //   ID: 'string',
        //   // Add custom scalar mappings as needed
        // };
        this.typeMapping = {
            String: 'string',
            Int: 'int32',
            Float: 'float',
            Boolean: 'bool',
            ID: 'string',
            Date: 'Date',
            DateTime: 'DateTime',
            Time: 'Time',
            JSON: 'string',
            JSONB: 'string',
            UUID: 'string',
            // Add custom scalars if needed
        };
    }
    async generate() {
        const objectTypes = this.graphQLParser.getObjectTypes();
        const messages = this.generateMessages(objectTypes);
        const generatedMessages = messages.map((msg) => msg.toString()).join('\n\n');
        const templatePath = this.config.get('protoTemplatePath') || 'messages.proto.template';
        const outputPath = this.config.get('protoOutputPath') || join(this.config.get('outputDir'), 'messages.proto');
        generateProtobufFile(templatePath, outputPath, generatedMessages);
    }
    generateMessages(types) {
        const messages = [];
        for (const typeNode of types) {
            const typeDirectives = this.directiveParser.parseDirectives(typeNode.directives);
            if (typeDirectives.exclude) {
                continue; // Skip the entire type
            }
            const message = new ProtoMessage(typeNode.name.value);
            let fieldNumber = 1;
            for (const field of typeNode.fields || []) {
                const fieldName = field.name.value;
                const directives = this.directiveParser.parseDirectives(field.directives);
                if (directives.exclude) {
                    continue; // Skip this field
                }
                let fieldTypeInfo = this.resolveType(field.type);
                if (directives.transform) {
                    fieldTypeInfo = this.applyTransform(fieldTypeInfo, directives.transform);
                }
                if (!fieldTypeInfo) {
                    console.warn(`Type for field ${fieldName} could not be resolved.`);
                    continue;
                }
                const protoField = new ProtoField(fieldTypeInfo.type, fieldName, fieldNumber++, fieldTypeInfo.repeated);
                if (directives.secure) {
                    protoField.addComment(`Field is secured with hash: ${directives.secure.hash}`);
                }
                if (directives.transform?.oneof) {
                    const oneofGroupName = directives.transform.oneof || 'defaultOneofGroup';
                    message.addToOneof(protoField, oneofGroupName);
                }
                else {
                    message.addField(protoField);
                }
            }
            messages.push(message);
        }
        return messages;
    }
    resolveType(typeNode) {
        if (typeNode.kind === 'NamedType') {
            const typeName = typeNode.name.value;
            const mappedType = this.typeMapping[typeName] || typeName;
            return { type: mappedType, repeated: false };
        }
        else if (typeNode.kind === 'NonNullType') {
            return this.resolveType(typeNode.type);
        }
        else if (typeNode.kind === 'ListType') {
            const innerType = this.resolveType(typeNode.type);
            if (innerType) {
                return { type: innerType.type, repeated: true };
            }
        }
        return null;
    }
    applyTransform(fieldTypeInfo, transform) {
        if (fieldTypeInfo && transform) {
            // Override type
            if (transform.type) {
                fieldTypeInfo.type = transform.custom_type || transform.type;
                if (transform.type === 'map' && transform.map_key && transform.map_value) {
                    fieldTypeInfo.type = `map<${transform.map_key}, ${transform.map_value}>`;
                    fieldTypeInfo.repeated = false;
                }
            }
            // Override repeated
            if (typeof transform.repeated === 'boolean') {
                fieldTypeInfo.repeated = transform.repeated;
            }
        }
        else {
            return null;
        }
        return fieldTypeInfo;
    }
}
