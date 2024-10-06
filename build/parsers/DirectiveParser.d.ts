import { GraphQLField, GraphQLInputField } from 'graphql';
export interface ParsedDirectives {
    exclude?: boolean;
    transform?: string;
    [key: string]: any;
}
export declare class DirectiveParser {
    parseFieldDirectives(field: GraphQLField<any, any> | GraphQLInputField): ParsedDirectives;
    private getArgumentValue;
}
