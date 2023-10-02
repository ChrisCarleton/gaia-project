import type { CodegenConfig } from '@graphql-codegen/cli';
import path from 'path';

const schema = path.resolve(__dirname, './src/schema.graphql');
const generatedFile = path.resolve(__dirname, './src/graphql.ts');

const config: CodegenConfig = {
  overwrite: true,
  schema,
  generates: {
    [generatedFile]: {
      plugins: [
        'typescript',
        'typescript-resolvers',
        'typescript-document-nodes',
      ],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
