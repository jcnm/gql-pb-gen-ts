
# GraphQL Protobuff generator

## Addressed problematics

- **Consistency Across Systems**: Automation ensures that both your GraphQL schemas and protobuf definitions are always in sync. This consistency reduces the risk of data mismatches and communication errors between services and clients.
- **Reduced Manual Work**: Manually maintaining parallel schemas in GraphQL and protobuf can be time-consuming and error-prone. Automation eliminates repetitive tasks, allowing developers to focus on more critical aspects of the project.
- **Faster Iterations**: With automated translation, any changes made to the GraphQL schema can be quickly propagated to the protobuf definitions. This rapid update cycle accelerates development and deployment processes.
- **Improved Maintainability**: Automation tools can handle complex schema transformations and edge cases, making it easier to maintain and evolve your APIs over time.
- **Enhanced Collaboration**: A unified schema approach simplifies understanding for all team members, including front-end and back-end developers, leading to better collaboration and fewer misunderstandings.

## How It Works

### 1. Custom Annotations in GraphQL:

- **Define Directives**: GraphQL allows you to define custom directives (annotations) that can be attached to fields, types, or other schema elements.
- **Annotate Fields**: You can use these directives to mark fields that require special handling. For example, you might have directives like @exclude, @internal, or @secure.
- 
### 2. Translation Tooling:

- **Parsing Annotations**: Your translation tool or script reads the GraphQL schema and parses the annotations.
- **Conditional Logic**: Based on the annotations, the tool decides whether to include, exclude, or transform a field in the protobuf definition.
- **Security Transformations**: For fields that need to be transformed (e.g., encrypted, hashed), the tool applies the necessary transformations during translation.

### 3. Output Generation

- **Protobuf Definitions**: The tool generates protobuf definitions based on the translated schema.
- **Type Mapping**: GraphQL types are mapped to protobuf types, ensuring that the data structures are compatible across systems.
- **Custom Logic**: The tool can also include custom logic or transformations in the generated code, depending on the annotations.

### 4. Integration with Codebase

- **Generated Code**: The generated protobuf definitions can be integrated into your codebase, allowing you to use them in your services and clients.
- **Compile and Build**: You can compile the protobuf definitions to generate client libraries, server stubs, or other artifacts for your system.
- **Runtime Behavior**: The translated schema and generated code ensure that your services and clients communicate effectively and securely.

## Benefits

### 1. Enhanced Security

- **Data Protection**: By excluding sensitive fields or transforming them appropriately, you reduce the risk of exposing confidential information.
- **Compliance**: Helps in meeting regulatory requirements by ensuring sensitive data is handled according to security policies.

### 2. Flexibility and Control

- **Fine-Grained Control**: Annotations provide a way to control the translation at the field level.
- **Custom Behavior**: Allows for custom translation behaviors without changing the underlying schema or writing extensive custom code.

### 3. Consistency and Maintainability

- **Single Source of Truth**: Keeping annotations within the schema ensures that all metadata about field handling is centralized.
- **Ease of Updates**: Changes to annotations automatically reflect in the translation process, making maintenance easier.