import { ErrorResponse, ValidationErrorDetails } from '@gaia-project/api';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ZodError } from 'zod';

import { BunyanLogger, Config } from './common';

abstract class ExceptionFilterBase implements ExceptionFilter {
  constructor(
    protected readonly log: BunyanLogger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  protected abstract getResponse(
    exception: unknown,
    response: ErrorResponse,
  ): void;

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const responseBody: ErrorResponse = {
      method: httpAdapter.getRequestMethod(request),
      path: httpAdapter.getRequestUrl(request),
      status: 500,
      message: 'An unhandled server error has occurred.',
    };

    if (exception instanceof Error) {
      response.message = exception.message;
      if (!Config.isProduction) response.stack = exception.stack;
    }

    this.getResponse(exception, responseBody);

    httpAdapter.reply(response, responseBody, responseBody.status);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter extends ExceptionFilterBase {
  protected getResponse(
    exception: HttpException,
    response: ErrorResponse,
  ): void {
    this.log.error(exception);
    response.status = exception.getStatus();
  }
}

@Catch(ZodError)
export class ValidationExceptionFilter extends ExceptionFilterBase {
  protected getResponse(exception: ZodError, response: ErrorResponse): void {
    this.log.debug(exception);
    const details: ValidationErrorDetails = { issues: exception.issues };
    response.details = details;
    response.status = 400;
  }
}

@Catch()
export class GenericExceptionFilter extends ExceptionFilterBase {
  protected getResponse(exception: unknown): void {
    this.log.error(exception);
  }
}
