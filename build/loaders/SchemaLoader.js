import { parse, buildClientSchema, getIntrospectionQuery, printSchema, buildSchema } from 'graphql';
import { readFileSync, existsSync } from 'fs';
export class SchemaLoader {
    constructor(config) {
        this.config = config;
    }
    async loadSchemaAST() {
        if (this.config.get('schemaPath') && existsSync(this.config.get('schemaPath'))) {
            return this.loadFromFile(this.config.get('schemaPath'));
        }
        else if (this.config.get('endpointUrl')) {
            return this.loadFromEndpoint(this.config.get('endpointUrl'));
        }
        else {
            throw new Error('No schema source provided.');
        }
    }
    loadFromFile(path) {
        const schemaContent = readFileSync(path, 'utf-8');
        return parse(schemaContent);
    }
    async loadFromSDLEndpoint(url) {
        const sdlResponse = await fetch(`${url}/sdl`, {
            method: 'GET',
            headers: { 'Accept': 'text/plain' },
        });
        if (!sdlResponse.ok) {
            throw new Error(`Failed to fetch SDL schema from endpoint: ${sdlResponse.statusText}`);
        }
        const sdlSchema = await sdlResponse.text();
        return buildSchema(sdlSchema);
    }
    async loadFromEndpoint(url) {
        const introspectionQuery = getIntrospectionQuery();
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: introspectionQuery }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(`Failed to fetch schema from endpoint: ${errors.map((e) => e.message).join(', ')}`);
        }
        const schema = buildClientSchema(data);
        // Convert the schema back to SDL and parse it to get the AST
        const sdl = printSchema(schema);
        return parse(sdl);
    }
}
