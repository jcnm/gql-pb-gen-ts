// src/loaders/SchemaLoader.ts
import { readFileSync } from 'fs';
import { Config } from '../config/Config.js';
import {
  GraphQLSchema,
  buildClientSchema,
  getIntrospectionQuery,
  IntrospectionQuery,
  printSchema,
  parse,
  buildSchema,
} from 'graphql';

export class SchemaLoader {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async loadSchema(): Promise<GraphQLSchema> {
    if (this.config.get('schemaPath')) {
      return this.loadFromFile(this.config.get('schemaPath')!);
    } else if (this.config.get('endpointUrl')) {
      return this.loadFromEndpoint(this.config.get('endpointUrl')!);
    } else {
      throw new Error('No schema source provided.');
    }
  }

  private loadFromFile(path: string): GraphQLSchema {
    const schemaContent = readFileSync(path, 'utf-8');
    return buildSchema(schemaContent);
  }
  private async loadFromSDLEndpoint(url: string): Promise<GraphQLSchema> {
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

  private async loadFromEndpoint(url: string): Promise<GraphQLSchema> {
    const introspectionQuery = getIntrospectionQuery();

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(`Failed to fetch schema from endpoint: ${errors.map((e: any) => e.message).join(', ')}`);
    }
    const introspectionData = data as IntrospectionQuery;

    // Build the schema from introspection data
    const schema = buildClientSchema(introspectionData);

    console.log(JSON.stringify(data, null, 2));
    // Optionally, print the schema in SDL format if needed
    const sdl = printSchema(schema);
    console.log("\n\n\n\n\n Outputting SDL \n\n\n\n\n");
    console.log(sdl);
    return schema;
  }
}
