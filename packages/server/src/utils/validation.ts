import { ZodIssue, z } from 'zod';

import { ValidationError, ValidationIssue } from '../errors';

export function zodIssueToValidationIssue(issue: ZodIssue): ValidationIssue {
  return {
    code: issue.code,
    message: issue.message,
    path: issue.path.map((el) => el.toString()).join('.'),
  };
}

export function isValid<
  TOut = unknown,
  TIn = TOut,
  Def extends z.ZodTypeDef = z.ZodTypeDef,
>(data: TIn, schema: z.ZodType<TOut, Def, TIn>): boolean {
  const { success } = schema.safeParse(data);
  return success;
}

export function assertValid<
  TOut,
  TIn = TOut,
  Def extends z.ZodTypeDef = z.ZodTypeDef,
>(data: unknown, schema: z.ZodType<TOut, Def, TIn>, message?: string): TOut {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  throw new ValidationError(
    message ?? 'Validation failed.',
    result.error.issues.map((issue) => zodIssueToValidationIssue(issue)),
  );
}
