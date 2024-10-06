// tests/loaders/SchemaLoader.test.ts
import { SchemaLoader } from '../../src/loaders/SchemaLoader';
import { Config } from '../../src/config/Config';
import { GraphQLSchema } from 'graphql';
import * as fs from 'fs';
import { globalAgent } from 'http';
import fetch from 'node-fetch';

jest.mock('fs'); 
jest.mock('node-fetch'); 
(fetch as unknown as jest.Mock).mockImplementation(async (url: string, options: any) => {
  // Mock implementation
  return {} as any;
});

// (global.fetch as jest.Mock).mockImplementation((path, data) => {
//   // Simulate a file write error
//   return {} as any;
// });


describe('SchemaLoader', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load schema from file', async () => {
      const config = new Config({ schemaPath: 'schema.graphql' });
      const mockSchemaContent = `
      type Query {
          hello: String
      }
      `;
      jest.spyOn(fs, 'readFileSync').mockReturnValue(mockSchemaContent);

      const schemaLoader = new SchemaLoader(config);
      const schema = await schemaLoader.loadSchema();

      expect(fs.readFileSync).toHaveBeenCalledWith('schema.graphql', 'utf-8');
      expect(schema.getType('Query')).toBeDefined();
  }); 
  
  // it('should load schema from endpoint', async () => {
  //   const config = new Config({ endpointUrl: 'https://dev-gateway.sh1.hidora.net/graphql' });
  //   const mockResponse = {
  //     json: jest.fn().mockResolvedValue({
  //       data: {
  //         __schema: {
  //           queryType: { name: 'Query' },
  //           types: [{ kind: 'OBJECT', name: 'Query', fields: [] }],
  //         },
  //       },
  //     }),
  //   };
  //   (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(mockResponse as any);

  //   const schemaLoader = new SchemaLoader(config);
  //   const schema = await schemaLoader.loadSchema();

  //   expect(fetch).toHaveBeenCalledWith('https://dev-gateway.sh1.hidora.net/graphql', expect.any(Object));
  //   expect(schema.getType('Query')).toBeDefined();
  // });

  it('should throw an error if no schema source provided', async () => {
    const config = new Config({});
    const schemaLoader = new SchemaLoader(config);

    await expect(schemaLoader.loadSchema()).rejects.toThrow('No schema source provided.');
  });
});

