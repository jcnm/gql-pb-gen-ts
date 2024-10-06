import { DirectiveNode } from 'graphql';
import { ParsedDirectives } from '../types';
export declare class DirectiveParser {
    parseDirectives(directives: ReadonlyArray<DirectiveNode> | undefined): ParsedDirectives;
    private getArguments;
    private parseValueNode;
}
