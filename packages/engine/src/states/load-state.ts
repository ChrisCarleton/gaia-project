import { SerializedState } from '../core/serialization';
import { ObserverPublisher } from '../events';
import {
  ChangeStateFunction,
  GameContext,
  GameState,
  State,
} from '../interfaces';
import { ActionPhaseState } from './action-phase-state';
import { BuildFirstMinesState } from './build-first-mines-state';
import { ChooseFirstRoundBoostersState } from './choose-first-round-boosters-state';
import { GaiaPhaseState } from './gaia-phase-state';
import { GameCompletedState } from './game-completed-state';
import { GameNotStartedState } from './game-not-started-state';
import { IncomePhaseState } from './income-phase-state';

export function loadState(
  data: SerializedState,
  context: GameContext,
  events: ObserverPublisher,
  changeState: ChangeStateFunction,
): State {
  switch (data.type) {
    case GameState.ActionPhase:
      return new ActionPhaseState(
        context,
        events,
        changeState,
        context.players[data.player],
      );

    case GameState.BuildFirstMines:
      return new BuildFirstMinesState(context, events, changeState, {
        pass: data.pass,
        playerIndex: data.player,
      });

    case GameState.ChooseFirstRoundBoosters:
      return new ChooseFirstRoundBoostersState(
        context,
        events,
        changeState,
        data.player,
      );

    case GameState.GaiaPhase:
      return new GaiaPhaseState(context, events, changeState);

    case GameState.GameEnded:
      return new GameCompletedState(context, events, changeState);

    case GameState.GameNotStarted:
      return new GameNotStartedState();

    case GameState.IncomePhase:
      return new IncomePhaseState(context, events, changeState);
  }
}
