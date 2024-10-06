import { Config } from '../config/Config.js';
import { GraphQLSchema } from 'graphql';
export declare class SchemaLoader {
    private config;
    constructor(config: Config);
    loadSchema(): Promise<GraphQLSchema>;
    private loadFromFile;
    private loadFromSDLEndpoint;
    private loadFromEndpoint;
}
