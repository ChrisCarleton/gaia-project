export type ValidationIssue = {
  code: string;
  message: string;
  path: string;
};

export class ValidationError extends Error {
  constructor(
    message: string,
    readonly issues: ValidationIssue[],
  ) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
