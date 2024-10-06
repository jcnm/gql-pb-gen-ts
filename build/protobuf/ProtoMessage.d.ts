import { ProtoField } from './ProtoField';
export declare class ProtoMessage {
    name: string;
    fields: ProtoField[];
    oneofs: Map<string, ProtoField[]>;
    constructor(name: string);
    addField(field: ProtoField): void;
    addToOneof(field: ProtoField, oneofGroupName: string): void;
    toString(): string;
}
