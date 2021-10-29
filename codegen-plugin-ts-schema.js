// This is a plugin for graphql codegen, which generates a ts file containing a schema
// See https://www.graphql-code-generator.com/docs/custom-codegen/write-your-plugin
//
// It does the same as @graphql-codegen/schema-ast , but put the schema in a ts file with gql tag

const path = require("path");
const { plugin, transformSchemaAST } = require('@graphql-codegen/schema-ast');

module.exports = {
  plugin: async (schema, documents, config) => {
    const gqlSchema = await plugin(schema, documents, config);

    const formattedSchema = gqlSchema.replace(/\n([^\n])/g, "\n  $1");

    const output = `${config.gqlTagImport || 'import { gql } from "graphql-tag"'};

export const typeDefs = gql\`
  ${formattedSchema}\`;
`;
    return output;
  },
  validate: async (_schema, _documents, _config, outputFile, allPlugins) => {
    const singlePlugin = allPlugins.length === 1;
    if (singlePlugin && path.extname(outputFile) !== '.ts') {
      throw new Error(`Plugin "ts-schema" requires extension to be ".ts"!`);
    }
  },
  transformSchemaAST
};