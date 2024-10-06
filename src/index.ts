console.log("Hello, world!");

// src/index.ts
import { Config } from './config/Config.js';
import { SchemaLoader } from './loaders/SchemaLoader.js';
import { DirectiveLoader } from './loaders/DirectiveLoader.js';
import { GraphQLParser } from './parsers/GraphQLParser.js';
import { DirectiveParser } from './parsers/DirectiveParser.js';
import { ProtoGenerator } from './generators/ProtoGenerator.js';
import { Logger } from './utils/Logger.js';

async function main() {
  try {
    const config = new Config({
      endpointUrl: 'https://dev-gateway.sh1.hidora.net/graphql',
      outputDir: './proto',
      customDirectives: ['./directives.graphql'],
    });

    // Load custom directives
    const directiveLoader = new DirectiveLoader(config.get('customDirectives')!);
    directiveLoader.loadDirectives();

    // Load GraphQL schema from endpoint
    const schemaLoader = new SchemaLoader(config);
    const schema = await schemaLoader.loadSchema();

    // Parse schema and directives
    const graphQLParser = new GraphQLParser(schema);
    const directiveParser = new DirectiveParser();

    // Generate protobuf definitions
    const protoGenerator = new ProtoGenerator(config, graphQLParser, directiveParser);
    protoGenerator.generate();

    Logger.info('Protobuf generation completed successfully.');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
