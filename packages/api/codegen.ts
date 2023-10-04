import type { CodegenConfig } from '@graphql-codegen/cli';
import path from 'path';

const schema = path.resolve(__dirname, './schema.graphql');
const generatedResolvers = path.resolve(
  __dirname,
  './src/generated/resolvers.ts',
);
const generatedJson = path.resolve(__dirname, './src/generated/schema.json');
const generatedTypeDefs = path.resolve(
  __dirname,
  './src/generated/type-defs.ts',
);

const config: CodegenConfig = {
  overwrite: true,
  schema,
  generates: {
    [generatedResolvers]: {
      plugins: ['typescript', 'typescript-resolvers'],
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
