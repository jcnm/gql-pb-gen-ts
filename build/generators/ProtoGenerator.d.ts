import { GraphQLParser } from '../parsers/GraphQLParser';
import { DirectiveParser } from '../parsers/DirectiveParser';
import { Config } from '../config/Config';
export declare class ProtoGenerator {
    private config;
    private graphQLParser;
    private directiveParser;
    private typeMapping;
    constructor(config: Config, graphQLParser: GraphQLParser, directiveParser: DirectiveParser);
    generate(): Promise<void>;
    private generateMessages;
    private resolveType;
    private applyTransform;
}
