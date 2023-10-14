import type { CodegenConfig } from '@graphql-codegen/cli';
import path from 'path';

const schema = path.resolve(__dirname, './schema.graphql');
const documents = path.resolve(__dirname, './src/operations/**/*.graphql');
const generatedResolvers = path.resolve(
  __dirname,
  './src/generated/resolvers.ts',
);
const generatedJson = path.resolve(__dirname, './src/generated/schema.json');
const generatedTypeDefs = path.resolve(
  __dirname,
  './src/generated/type-defs.ts',
);
const generatedOperations = path.resolve(
  __dirname,
  './src/generated/operations.ts',
);

const config: CodegenConfig = {
  overwrite: true,
  schema,
  documents,
  generates: {
    [generatedResolvers]: {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        enumValues: {
          FactionType: '@gaia-project/engine#FactionType',
        },
      },
    },
    [generatedOperations]: {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        enumValues: {
          FactionType: '@gaia-project/engine#FactionType',
        },
        flattenGeneratedTypes: true,
      },
    },
    [generatedJson]: {
      plugins: ['introspection'],
    },
    [generatedTypeDefs]: {
      plugins: ['./codegen-gql-plugin.js'],
    },
  },
};

export default config;
