// src/parsers/GraphQLParser.ts
import { isObjectType } from 'graphql';
export class GraphQLParser {
    constructor(schema) {
        this.schema = schema;
    }
    getTypes() {
        return Object.values(this.schema.getTypeMap()).filter(type => isObjectType(type) && !type.name.startsWith('__'));
    }
}
