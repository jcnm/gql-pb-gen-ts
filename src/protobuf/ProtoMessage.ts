// src/protobuf/ProtoMessage.ts 
import { ProtoField } from './ProtoField';

export class ProtoMessage {
  name: string;
  fields: ProtoField[] = [];
  oneofs: Map<string, ProtoField[]> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  addField(field: ProtoField) {
    this.fields.push(field);
  }

  addToOneof(field: ProtoField, oneofGroupName: string) {
    if (!this.oneofs.has(oneofGroupName)) {
      this.oneofs.set(oneofGroupName, []);
    }
    this.oneofs.get(oneofGroupName)!.push(field);
  }

  toString(): string {
    const fieldsStr = this.fields.map((field) => `  ${field}`).join('\n');

    const oneofStr = Array.from(this.oneofs.entries())
      .map(([groupName, fields]) => {
        const fieldsInOneof = fields.map((field) => `    ${field.type} ${field.name} = ${field.number};`).join('\n');
        return `  oneof ${groupName} {\n${fieldsInOneof}\n  }`;
      })
      .join('\n');

    return `message ${this.name} {\n${fieldsStr}\n${oneofStr}\n}`;
  }
}
