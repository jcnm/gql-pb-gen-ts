import { GraphQLSchema, GraphQLObjectType } from 'graphql';
export declare class GraphQLParser {
    private schema;
    constructor(schema: GraphQLSchema);
    getTypes(): GraphQLObjectType<any, any>[];
}
