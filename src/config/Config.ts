// src/config/Config.ts
export interface ConfigOptions {
  schemaPath?: string;
  endpointUrl?: string;
  outputDir?: string;
  customDirectives?: string[];
  protoTemplatePath?: string;
  protoOutputPath?: string;
  templatePlaceHolder?: string; 

}


export class Config {
  private options: ConfigOptions;

  constructor(options: ConfigOptions) {
      this.options = {
      outputDir: './generated',
      customDirectives: [],
      ...options,
      };
  }

  get<K extends keyof ConfigOptions>(key: K): ConfigOptions[K] {
      return this.options[key];
  }
}
  