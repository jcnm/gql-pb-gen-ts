export class ProtoMessage {
    constructor(name) {
        this.fields = [];
        this.oneofs = new Map();
        this.name = name;
    }
    addField(field) {
        this.fields.push(field);
    }
    addToOneof(field, oneofGroupName) {
        if (!this.oneofs.has(oneofGroupName)) {
            this.oneofs.set(oneofGroupName, []);
        }
        this.oneofs.get(oneofGroupName).push(field);
    }
    toString() {
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
