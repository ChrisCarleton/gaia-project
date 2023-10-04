/* eslint-disable */
const { printSchemaWithDirectives } = require('@graphql-tools/utils');
const { stripIgnoredCharacters } = require('graphql');

module.exports = {
  plugin(schema) {
    return `
import { gql } from 'graphql-tag';
export const typeDefs = gql\`${stripIgnoredCharacters(
      printSchemaWithDirectives(schema),
    )}\`;`;
  },
};
