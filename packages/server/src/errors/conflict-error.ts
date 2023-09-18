export class ConflictError extends Error {
  constructor(
    message: string,
    readonly conflictingFields: string | string[],
  ) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
