// src/types/index.ts
export type ScalarType =
  | 'String'
  | 'Int'
  | 'Float'
  | 'Boolean'
  | 'ID';

  // src/types/index.d.ts

export interface ParsedDirectives {
    exclude?: boolean,
    secure?: {
      hash: string,
    },
    transform?: {
      type: string;
      custom_type?: string,
      repeated?: boolean,
      oneof?: string, 
      map_key?: string,
      map_value?: string,
    },
    [key: string]: any,
  }
