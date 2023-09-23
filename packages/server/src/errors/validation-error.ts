import { ValidationIssue } from '@gaia-project/api';

export class ValidationError extends Error {
  constructor(
    message: string,
    readonly issues: ValidationIssue[],
  ) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
