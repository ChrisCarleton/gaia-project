import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ErrorCode } from '@gaia-project/api';
import { GraphQLFormattedError } from 'graphql';

import { BadRequestError } from './bad-request-error';
import { ConflictError } from './conflict-error';
import { ForbiddenError } from './forbidden-error';
import { UnauthorizedError } from './unauthorized-error';
import { ValidationError } from './validation-error';

export function formatError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  if (error instanceof BadRequestError) {
    return {
      message: error.message,
      extensions: {
        code: ApolloServerErrorCode.BAD_REQUEST,
      },
    };
  }

  if (error instanceof ConflictError) {
    return {
      message: error.message,
      extensions: {
        code: ErrorCode.Conflict,
        conflictingFields: error.conflictingFields,
      },
    };
  }

  if (error instanceof ForbiddenError) {
    return {
      message: error.message,
      extensions: {
        code: ErrorCode.Forbidden,
      },
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      message: error.message,
      extensions: {
        code: ErrorCode.Unauthorized,
      },
    };
  }

  if (error instanceof ValidationError) {
    return {
      message: error.message,
      extensions: {
        code: ErrorCode.Validation,
        issues: error.issues,
      },
    };
  }

  return formattedError;
}
