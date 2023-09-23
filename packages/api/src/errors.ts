import { z } from 'zod';

export const ValidationIssueSchema = z.object({
  code: z.string(),
  message: z.string(),
  path: z.string(),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

export const ValidationErrorDetailsSchema = z.object({
  issues: ValidationIssueSchema.array(),
});

export const ConflictErrorDetailsSchema = z.object({
  conflictingFields: z.union([z.string(), z.string().array()]),
});

export const ErrorResponseSchema = z.object({
  status: z.number().int(),
  message: z.string(),
  method: z.string(),
  path: z.string(),
  details: z.unknown().optional(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
    })
    .optional(),
  stack: z.string().optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
