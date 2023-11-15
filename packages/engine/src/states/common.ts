import { GameState, Player } from '../interfaces';

export type NextStateOptions =
  | { nextState: GameState.GameEnded | GameState.IncomePhase }
  | { nextState: GameState.ActionPhase; nextPlayer: Player };
