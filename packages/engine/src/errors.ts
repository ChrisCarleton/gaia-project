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
  InvalidRoundBooster,
  ResearchTrackTierFiveOccupied,
  RoundBoosterNotSelected,

  // Resource issues
  InsufficientCredits,
  InsufficientKnowledge,
  InsufficientOre,
  InsufficientPower,
  InsufficientQICs,
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
