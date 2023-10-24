import { ErrorCode, GPError } from '../errors';
import { EventType } from '../events/event-args';
import { Observer } from '../events/observer';
import { FactionType } from '../factions';
import {
  ChangeStateFunction,
  GameAction,
  GameContext,
  GameState,
  MapHex,
} from '../interfaces';
import { ChooseFirstRoundBoostersState } from './choose-first-round-boosters-state';
import { StateBase } from './state-base';

export enum BuildFirstMinesPass {
  First,
  Second,
  Xenos,
}
export type BuildFirstMinesOptions = {
  turnIndex: number;
  pass: BuildFirstMinesPass;
};

export class BuildFirstMinesState extends StateBase {
  constructor(
    context: GameContext,
    events: Observer,
    changeState: ChangeStateFunction,
    private readonly options: BuildFirstMinesOptions,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.BuildFirstMines;
  }

  init(): void {
    // Alert the current player that they need to place a fresh mine.
    this.events.publish({
      type: EventType.AwaitingPlayerInput,
      player: this.context.players[this.options.turnIndex],
      gameState: this.currentState,
      allowedActions: [GameAction.BuildMine],
    });
  }

  buildMine(location: MapHex): void {
    // Identify the player. Unlike normal turn order, initial mine selection is done twice:
    // Once in turn order, then again in reverse turn order.
    // ... and the Xenos get to place a third mine after all that!
    const player = this.context.players[this.options.turnIndex];

    // Validate hex. Must be unoccupied and contain a planet matching the player's home world.
    if (!location.planet) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        'New mine must be built on a planet.',
      );
    }

    if (location.planet !== player.faction.homeWorld) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        "Mine can only be built on the player's homeworld type.",
      );
    }

    if (location.structure) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        'Mine can only be placed on an unoccupied planet.',
      );
    }

    // Place mine event.
    this.events.publish({
      type: EventType.MineBuilt,
      player,
      location,
    });

    if (this.options.pass === BuildFirstMinesPass.First) {
      if (this.options.turnIndex === this.context.players.length - 1) {
        this.options.pass = BuildFirstMinesPass.Second;
      } else {
        this.options.turnIndex++;
      }
    } else if (this.options.pass === BuildFirstMinesPass.Second) {
      if (this.options.turnIndex === 0) {
        this.options.turnIndex = this.context.players.findIndex(
          (player) => player.faction.factionType === FactionType.Xenos,
        );
        if (this.options.turnIndex === -1) {
          this.changeState(
            new ChooseFirstRoundBoostersState(
              this.context,
              this.events,
              this.changeState,
              this.context.players[this.context.players.length - 1],
            ),
          );
          return;
        } else {
          this.options.pass = BuildFirstMinesPass.Xenos;
        }
      } else {
        this.options.turnIndex--;
      }
    } else {
      this.changeState(
        new ChooseFirstRoundBoostersState(
          this.context,
          this.events,
          this.changeState,
          this.context.players[this.context.players.length - 1],
        ),
      );
      return;
    }

    this.changeState(
      new BuildFirstMinesState(
        this.context,
        this.events,
        this.changeState,
        this.options,
      ),
    );
  }
}
