import { ErrorResponse } from '@gaia-project/api';
import { Express, NextFunction, Request, Response } from 'express';

import config from '../../config';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../errors';

const FourOhFourError = new NotFoundError(
  'The resource or method you requested does not exist.',
);

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(FourOhFourError);
}

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,

  // All four parameters must be present for Express to recognize this function as an error handler!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  const response: ErrorResponse = {
    status: 500,
    message: err.message,
    method: req.method,
    path: req.originalUrl,
    ...(req.user
      ? { user: { id: req.user.id, email: req.user.email } }
      : undefined),
    ...(config.isProduction ? { stack: err.stack } : undefined),
  };

  if (err instanceof BadRequestError) {
    response.status = 400;
  }

  if (err instanceof ValidationError) {
    response.status = 400;
    response.details = {
      issues: err.issues,
    };
  }

  if (err instanceof UnauthorizedError) {
    response.status = 401;
  }

  if (err instanceof ForbiddenError) {
    response.status = 403;
  }

  if (err instanceof NotFoundError) {
    response.status = 404;
  }

  if (err instanceof ConflictError) {
    response.status = 409;
    response.details = {
      conflictingFields: err.conflictingFields,
    };
  }

  // Log at error level for server errors.
  // Log at warn level for security-related errors (Forbidden & Unuauthorized).
  // Log at debug level for everything else.
  if (response.status >= 500) {
    req.log.error(err);
  } else if (response.status === 401 || response.status === 403) {
    req.log.warn(err);
  } else {
    req.log.debug(err);
  }
  res.status(response.status).json(response);
}

export function configureErrorHandlerRoutes(app: Express) {
  app.all('*', notFound);
  app.use(globalErrorHandler);
}
