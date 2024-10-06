export declare class ProtoField {
    type: string;
    name: string;
    number: number;
    repeated: boolean;
    comments: string[];
    /**
     * Creates a new ProtoField instance.
     * @param type The type of the field.
     * @param name The name of the field.
     * @param number The field number into protobuf.
     * @param repeated Whether the field is repeated.
     * @returns A new ProtoField instance.
     * @constructor
     * @public
     * @memberof ProtoField
     * @instance
     * @method
     */
    constructor(type: string, name: string, number: number, repeated?: boolean);
    addComment(comment: string): void;
    toString(): string;
}
