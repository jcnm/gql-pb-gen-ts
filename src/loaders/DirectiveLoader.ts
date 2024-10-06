// src/loaders/DirectiveLoader.ts
import { DirectiveDefinitionNode, parse } from 'graphql';
import { readFileSync } from 'fs';

export class DirectiveLoader {
  private directiveDefinitions: DirectiveDefinitionNode[] = [];

  constructor(private directiveFiles: string[]) {}

  loadDirectives(): DirectiveDefinitionNode[] {
    this.directiveDefinitions = this.directiveFiles.flatMap(file => {
      const content = readFileSync(file, 'utf-8');
      const parsed = parse(content);
      return parsed.definitions.filter(
        def => def.kind === 'DirectiveDefinition'
      ) as DirectiveDefinitionNode[];
    });
    return this.directiveDefinitions;
  }
}
