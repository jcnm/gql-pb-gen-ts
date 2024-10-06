console.log("Hello, world!");
// src/index.ts
import { Config } from './config/Config.js';
import { SchemaLoader } from './loaders/SchemaLoader.js';
import { GraphQLParser } from './parsers/GraphQLParser.js';
import { DirectiveParser } from './parsers/DirectiveParser.js';
import { ProtoGenerator } from './generators/ProtoGenerator.js';
import { Logger } from './utils/Logger.js';
// const config = new Config({
//       endpointUrl: 'https://dev-gateway.sh1.hidora.net/graphql',
//       outputDir: './proto',
//       customDirectives: ['./directives.graphql'],
//     });
// src/index.ts
async function main() {
    try {
        const config = new Config({
            schemaPath: './s2.graphql',
            endpointUrl: 'https://dev-gateway.sh1.hidora.net/graphql',
            outputDir: './proto',
            protoOutputPath: './proto/s2.proto',
            customDirectives: ['./directives.graphql'],
            protoTemplatePath: './templates/messages.proto.in',
            templatePlaceHolder: '{{ generated_messages }}',
        });
        // Load GraphQL schema AST
        const schemaLoader = new SchemaLoader(config);
        const schemaAst = await schemaLoader.loadSchemaAST();
        // Parse schema and directives
        const graphQLParser = new GraphQLParser(schemaAst);
        const directiveParser = new DirectiveParser();
        // Generate protobuf definitions
        const protoGenerator = new ProtoGenerator(config, graphQLParser, directiveParser);
        await protoGenerator.generate();
        Logger.info('Protobuf generation completed successfully.');
    }
    catch (error) {
        Logger.error(JSON.stringify(error));
        process.exit(1);
    }
}
// async function main() {
//   try {
//     // Load custom directives
//     const directiveLoader = new DirectiveLoader(config.get('customDirectives')!);
//     directiveLoader.loadDirectives();
//     // Load GraphQL schema from endpoint
//     const schemaLoader = new SchemaLoader(config);
//     async function generateProtobufFromSchema(schemaContent: string, outputPath: string) {
//         const schemaAst = parse(schemaContent);
//         const types = Pro(schemaAst);
//         const messages = generateProtoMessages(types);
//         await writeProtoFile(messages, outputPath);
//       }
//     // PREVIOUSLY: Load schema from file
// //     const schema = await schemaLoader.loadSchema();
// //     // Parse schema and directives
// //     const graphQLParser = new GraphQLParser(schema);
// //     const directiveParser = new DirectiveParser();
// //     // Generate protobuf definitions
// //     const protoGenerator = new ProtoGenerator(config, graphQLParser, directiveParser);
// //     protoGenerator.generate();
// //     Logger.info('Protobuf generation completed successfully.');
// //   } catch (error) {
// //     console.log(error);
// //     process.exit(1);
// //   }
// }
main();
