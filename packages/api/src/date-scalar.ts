import { GraphQLScalarType, Kind } from 'graphql';

export const DateScalar = new GraphQLScalarType<Date | null, string>({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(date) {
    if (date instanceof Date) {
      return date.toISOString();
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL Date Scalar parser expected an ISO date string');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(ast.value);
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});
