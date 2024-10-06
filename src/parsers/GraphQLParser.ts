// src/parsers/GraphQLParser.ts
import { DocumentNode, visit, ObjectTypeDefinitionNode, EnumTypeDefinitionNode } from 'graphql';

export class GraphQLParser {
  private schemaAst: DocumentNode;
  private objectTypes: ObjectTypeDefinitionNode[] = [];
  private enumTypes: EnumTypeDefinitionNode[] = [];

  constructor(schemaAst: DocumentNode) {
    this.schemaAst = schemaAst;
    this.extractTypes();
  }

  private extractTypes() {
    visit(this.schemaAst, {
      ObjectTypeDefinition: (node) => {
        if (!node.name.value.startsWith('__')) {
          this.objectTypes.push(node);
        }
      },
      EnumTypeDefinition: (node) => {
        this.enumTypes.push(node);
      },
      // Add more visitors for interfaces, unions, etc., if needed
    });
  }

  getObjectTypes(): ObjectTypeDefinitionNode[] {
    return this.objectTypes;
  }

  getEnumTypes(): EnumTypeDefinitionNode[] {
    return this.enumTypes;
  }

  // TODO: add methods to get interfaces, unions, etc.
}
