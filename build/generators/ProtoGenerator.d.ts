import { GraphQLParser } from '../parsers/GraphQLParser.js';
import { DirectiveParser } from '../parsers/DirectiveParser.js';
import { Config } from '../config/Config.js';
export declare class ProtoGenerator {
    private config;
    private graphQLParser;
    private directiveParser;
    private typeMapping;
    constructor(config: Config, graphQLParser: GraphQLParser, directiveParser: DirectiveParser);
    generate(): void;
    /**
     *
     * @param type  The GraphQLObjectType to generate a message for
     * @returns   The generated protobuf message definition
     */
    private generateMessage;
    private resolveType;
    private applyTransformations;
}
