export enum ErrorCode {
  // Player selection.
  TooFewPlayers,
  TooManyPlayers,
  FactionConflict,

  // State related errors
  ActionNotSupportedNow,
  GameAlreadyBegun,
  GameNotStarted,

  // Invalid action errors
  InvalidMinePlacement,
}

export class GPError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, GPError.prototype);
  }
}
