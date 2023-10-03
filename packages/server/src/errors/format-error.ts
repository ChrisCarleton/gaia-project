import { ApolloServerErrorCode } from '@apollo/server/errors';
import { InternalErrorCodes } from '@gaia-project/api';
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
        code: InternalErrorCodes.ConflictError,
        conflictingFields: error.conflictingFields,
      },
    };
  }

  if (error instanceof ForbiddenError) {
    return {
      message: error.message,
      extensions: {
        code: InternalErrorCodes.ForbiddenError,
      },
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      message: error.message,
      extensions: {
        code: InternalErrorCodes.UnauthorizedError,
      },
    };
  }

  if (error instanceof ValidationError) {
    return {
      message: error.message,
      extensions: {
        code: InternalErrorCodes.ValidationError,
        issues: error.issues,
      },
    };
  }

  return formattedError;
}
