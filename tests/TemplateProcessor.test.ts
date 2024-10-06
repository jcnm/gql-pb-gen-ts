import { writeProtobufTemplateFile } from '../src/utils/TemplateProcessor';
import { readFileSync, writeFileSync } from 'fs';

jest.mock('fs');

describe('TemplateProcessor', () => {
  test('should compile and write protobuf template to output', () => {
    const templatePath = 'template.proto';
    const outputPath = 'output.proto';
    const templateContent = 'syntax = "proto3";\n{{generated_messages}}';
    const generatedMessages = 'message Test {}';

    (readFileSync as jest.Mock).mockReturnValue(templateContent);
    (writeFileSync as jest.Mock).mockImplementation(() => {});

    writeProtobufTemplateFile(templatePath, outputPath, generatedMessages);

    expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
    expect(writeFileSync).toHaveBeenCalledWith(outputPath, 'syntax = "proto3";\nmessage Test {}', 'utf-8');
  });
});
