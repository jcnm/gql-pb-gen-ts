export class DirectiveParser {
    parseFieldDirectives(field) {
        const directives = {};
        const astNode = field.astNode;
        if (astNode && astNode.directives) {
            for (const directive of astNode.directives) {
                const name = directive.name.value;
                if (name === 'exclude') {
                    directives.exclude = true;
                }
                else if (name === 'transform') {
                    directives.transform = this.getArgumentValue(directive, 'type');
                }
                // Handle other directives as needed
            }
        }
        return directives;
    }
    getArgumentValue(directive, argName) {
        const arg = directive.arguments.find((arg) => arg.name.value === argName);
        return arg?.value?.value;
    }
}
