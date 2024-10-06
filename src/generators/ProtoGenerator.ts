
// src/generators/ProtoGenerator.ts
import { GraphQLParser } from '../parsers/GraphQLParser';
import { DirectiveParser } from '../parsers/DirectiveParser'; 
import { join } from 'path';
import { Config } from '../config/Config';
import { GraphQLObjectType, GraphQLType, isNonNullType, isListType, isScalarType, isObjectType, isEnumType, isAbstractType, isCompositeType, isDirective, isOutputType, isInputType, isInputObjectType, isInterfaceType, isNamedType, isUnionType, ObjectTypeDefinitionNode, TypeNode } from 'graphql';
import { ParsedDirectives, ScalarType } from '../types/index';
import { ProtoField } from './../protobuf/ProtoField.js'; 
import { ProtoMessage } from './../protobuf/ProtoMessage.js'; 
import { generateProtobufFile }  from '../utils/TemplateProcessor.js';

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
  // private typeMapping: Record<string, string> = {
  //   String: 'string',
  //   Int: 'int32',
  //   Float: 'float',
  //   Boolean: 'bool',
  //   ID: 'string',
  //   // Add custom scalar mappings as needed
  // };

  private typeMapping: Record<string, string> = {
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
  
  constructor(
    private config: Config,
    private graphQLParser: GraphQLParser,
    private directiveParser: DirectiveParser
  ) {}

  async generate() {
    const objectTypes = this.graphQLParser.getObjectTypes();
    const messages = this.generateMessages(objectTypes);
    const generatedMessages = messages.map((msg) => msg.toString()).join('\n\n');

    const templatePath = this.config.get('protoTemplatePath') || 'messages.proto.template';
    const outputPath = this.config.get('protoOutputPath') || join(this.config.get('outputDir')!, 'messages.proto');
    generateProtobufFile(templatePath, outputPath, generatedMessages);
  }

  private generateMessages(types: ObjectTypeDefinitionNode[]): ProtoMessage[] {
    const messages: ProtoMessage[] = [];
  
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
  
        const protoField = new ProtoField(
          fieldTypeInfo.type,
          fieldName,
          fieldNumber++,
          fieldTypeInfo.repeated
        );
  
        if (directives.secure) {
          protoField.addComment(`Field is secured with hash: ${directives.secure.hash}`);
        }
  
        if (directives.transform?.oneof) {
          const oneofGroupName = directives.transform.oneof || 'defaultOneofGroup';
          message.addToOneof(protoField, oneofGroupName);
        } else {
          message.addField(protoField);
        }
      }
  
      messages.push(message);
    }
  
    return messages;
  }
  

private generateEnums(enumNodes: EnumTypeDefinitionNode[]): string[] {
  return enumNodes.map((enumNode) => {
    const enumName = enumNode.name.value;
    const directives = this.directiveParser.parseDirectives(enumNode.directives);

    if (directives.exclude) {
      return ''; // Skip this enum
    }

    let enumTypeName = enumName;

    if (directives.transform?.custom_type) {
      enumTypeName = directives.transform.custom_type;
    }

    const enumValues = enumNode.values?.map((value, index) => {
      return `  ${value.name.value} = ${index};`;
    });

    return `enum ${enumTypeName} {\n${enumValues?.join('\n')}\n}`;
  });
}
  private resolveType(typeNode: TypeNode): { type: string; repeated: boolean } | null {
    if (typeNode.kind === 'NamedType') {
      const typeName = typeNode.name.value;
      const mappedType = this.typeMapping[typeName] || typeName;
      return { type: mappedType, repeated: false };
    } else if (typeNode.kind === 'NonNullType') {
      return this.resolveType(typeNode.type);
    } else if (typeNode.kind === 'ListType') {
      const innerType = this.resolveType(typeNode.type);
      if (innerType) {
        return { type: innerType.type, repeated: true };
      }
    }
    return null;
  }

  private applyTransform(
    fieldTypeInfo: { type: string; repeated: boolean } | null,
    transform: ParsedDirectives['transform']
  ): { type: string; repeated: boolean } | null {
    if (fieldTypeInfo && transform){
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
    } else {
      return null;
    }
    return fieldTypeInfo;
  }
}