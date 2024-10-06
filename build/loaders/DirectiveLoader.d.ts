import { DirectiveDefinitionNode } from 'graphql';
export declare class DirectiveLoader {
    private directiveFiles;
    private directiveDefinitions;
    constructor(directiveFiles: string[]);
    loadDirectives(): DirectiveDefinitionNode[];
}
