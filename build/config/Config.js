export class Config {
    constructor(options) {
        this.options = {
            outputDir: './generated',
            customDirectives: [],
            ...options,
        };
    }
    get(key) {
        return this.options[key];
    }
}
