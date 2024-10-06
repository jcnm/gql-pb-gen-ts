import { SchemaLoader } from '../../src/loaders/SchemaLoader';
import { Config } from '../../src/config/Config';
import { readFileSync, existsSync } from 'fs';

jest.mock('fs');
global.fetch = jest.fn();

describe('SchemaLoader', () => {
  let schemaLoader: SchemaLoader;
  let mockConfig: Config;

  beforeEach(() => {
    mockConfig = new Config();
    schemaLoader = new SchemaLoader(mockConfig);
  });

  test('should load schema from file', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFileSync as jest.Mock).mockReturnValue('type Query { test: String }');

    mockConfig.get = jest.fn().mockReturnValue('schema.graphql');

    const result = await schemaLoader.loadSchemaAST();

    expect(result).toBeDefined();
    expect(readFileSync).toHaveBeenCalledWith('schema.graphql', 'utf-8');
  });

  test('should throw error if no schema source is provided', async () => {
    mockConfig.get = jest.fn().mockReturnValue(undefined);

    await expect(schemaLoader.loadSchemaAST()).rejects.toThrow('No schema source provided.');
  });

  test('should load schema from endpoint', async () => {
    mockConfig.get = jest.fn().mockReturnValue('http://localhost/graphql');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: {}, errors: null }),
    });

    const result = await schemaLoader.loadSchemaAST();

    expect(result).toBeDefined();
  });
});
