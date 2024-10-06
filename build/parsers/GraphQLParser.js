// src/parsers/GraphQLParser.ts
import { visit } from 'graphql';
export class GraphQLParser {
    constructor(schemaAst) {
        this.objectTypes = [];
        this.enumTypes = [];
        this.schemaAst = schemaAst;
        this.extractTypes();
    }
    extractTypes() {
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
    getObjectTypes() {
        return this.objectTypes;
    }
    getEnumTypes() {
        return this.enumTypes;
    }
}
