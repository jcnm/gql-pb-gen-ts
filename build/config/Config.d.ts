export interface ConfigOptions {
    schemaPath?: string;
    endpointUrl?: string;
    outputDir?: string;
    customDirectives?: string[];
}
export declare class Config {
    private options;
    constructor(options: ConfigOptions);
    get<K extends keyof ConfigOptions>(key: K): ConfigOptions[K];
}
