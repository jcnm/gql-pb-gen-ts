// src/loaders/DirectiveLoader.ts
import { parse } from 'graphql';
import { readFileSync } from 'fs';
export class DirectiveLoader {
    constructor(directiveFiles) {
        this.directiveFiles = directiveFiles;
        this.directiveDefinitions = [];
    }
    loadDirectives() {
        this.directiveDefinitions = this.directiveFiles.flatMap(file => {
            const content = readFileSync(file, 'utf-8');
            const parsed = parse(content);
            return parsed.definitions.filter(def => def.kind === 'DirectiveDefinition');
        });
        return this.directiveDefinitions;
    }
}
