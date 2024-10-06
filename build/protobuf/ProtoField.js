// src/protobuf/ProtoField.ts
// This file defines the ProtoField class which represents a field in a protobuf message. 
export class ProtoField {
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
    constructor(type, name, number, repeated = false) {
        this.comments = [];
        this.type = type;
        this.name = name;
        this.number = number;
        this.repeated = repeated;
    }
    addComment(comment) {
        this.comments.push(comment);
    }
    toString() {
        const repeatedStr = this.repeated ? 'repeated ' : '';
        const commentsStr = this.comments.map((c) => `  // ${c}`).join('\n');
        const fieldStr = `${repeatedStr}${this.type} ${this.name} = ${this.number};`;
        return commentsStr ? `${commentsStr}\n  ${fieldStr}` : `  ${fieldStr}`;
    }
}
