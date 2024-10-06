import { DocumentNode, ObjectTypeDefinitionNode, EnumTypeDefinitionNode } from 'graphql';
export declare class GraphQLParser {
    private schemaAst;
    private objectTypes;
    private enumTypes;
    constructor(schemaAst: DocumentNode);
    private extractTypes;
    getObjectTypes(): ObjectTypeDefinitionNode[];
    getEnumTypes(): EnumTypeDefinitionNode[];
}
