import { Config } from '../config/Config';
import { DocumentNode } from 'graphql';
export declare class SchemaLoader {
    private config;
    constructor(config: Config);
    loadSchemaAST(): Promise<DocumentNode>;
    private loadFromFile;
    private loadFromSDLEndpoint;
    private loadFromEndpoint;
}
