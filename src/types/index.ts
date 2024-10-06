// src/types/index.ts
export type ScalarType =
  | 'String'
  | 'Int'
  | 'Float'
  | 'Boolean'
  | 'ID';

export interface TypeMapping {
  [key: string]: string;
}
