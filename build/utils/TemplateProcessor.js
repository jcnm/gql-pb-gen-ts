// src/utils/TemplateProcessor.ts
import Handlebars from 'handlebars';
import { readFileSync, writeFileSync } from 'fs';
export function generateProtobufFile(templatePath, outputPath, generatedMessages) {
    const templateContent = readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    const result = template({ generated_messages: generatedMessages });
    writeFileSync(outputPath, result, 'utf-8');
}
