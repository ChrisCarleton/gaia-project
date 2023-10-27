import { SerializedState } from '../core/serialization';
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
  Player,
} from '../interfaces';
import { ChooseFirstRoundBoostersState } from './choose-first-round-boosters-state';
import { StateBase } from './state-base';

export enum BuildFirstMinesPass {
  First,
  Second,
  Xenos, // Xenos get to build a third mine after everyone else has built two.
  Ivits, // Ivits do not build mines. Instead, they wait until everyone else has gone and then build their planetary institute.
}
export type BuildFirstMinesOptions = {
  turnIndex: number;
  pass: BuildFirstMinesPass;
};

type DetermineNextPlayerStrategyResult = {
  nextPlayerIndex: number;
  changePass?: BuildFirstMinesPass;
} | null;
type DetermineNextPlayerStrategy = (
  players: Readonly<Player[]>,
  currentIndex: number,
) => DetermineNextPlayerStrategyResult;
const DetermineNextPlayer: Record<
  BuildFirstMinesPass,
  DetermineNextPlayerStrategy
> = {
  // First pass: Iterate over players in order, skipping Ivits.
  [BuildFirstMinesPass.First]: (players, currentIndex) => {
    do {
      currentIndex++;

      if (currentIndex >= players.length)
        return {
          nextPlayerIndex: players.length - 1,
          changePass: BuildFirstMinesPass.Second,
        };
    } while (players[currentIndex].faction.factionType === FactionType.Ivits);

    return { nextPlayerIndex: currentIndex };
  },

  // Second pass: Iterate over players in reverse order, skipping Ivits.
  [BuildFirstMinesPass.Second]: (players, currentIndex) => {
    do {
      currentIndex--;

      if (currentIndex < 0) {
        // Is someone playing as Xenos?
        const xenosIndex = players.findIndex(
          (player) => player.faction.factionType === FactionType.Xenos,
        );
        if (xenosIndex > -1) {
          return {
            nextPlayerIndex: xenosIndex,
            changePass: BuildFirstMinesPass.Xenos,
          };
        }

        // What about Ivits?
        const ivitsIndex = players.findIndex(
          (player) => player.faction.factionType === FactionType.Ivits,
        );
        if (ivitsIndex > -1) {
          return {
            nextPlayerIndex: ivitsIndex,
            changePass: BuildFirstMinesPass.Ivits,
          };
        }

        // No? Cool! We're done.
        return null;
      }
    } while (players[currentIndex].faction.factionType === FactionType.Ivits);

    return { nextPlayerIndex: currentIndex };
  },

  // Xenos get to build a third mine after everyone else has gone.
  [BuildFirstMinesPass.Xenos]: (players) => {
    // Once the Xenos have built their third mine then we just need to check for Ivits.
    const ivitsIndex = players.findIndex(
      (player) => player.faction.factionType === FactionType.Ivits,
    );
    if (ivitsIndex > -1) {
      return {
        nextPlayerIndex: ivitsIndex,
        changePass: BuildFirstMinesPass.Ivits,
      };
    }

    // Otherwise, we're done.
    return null;
  },

  // Ivits go at the very end and build a Planetary Institution.
  [BuildFirstMinesPass.Ivits]: () => {
    // Nothing left to do after the Ivits have gone.
    return null;
  },
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

    if (location.planet.type !== player.faction.homeWorld) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        "Mine can only be built on the player's homeworld type.",
      );
    }

    if (location.planet.structure) {
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

    const nextPlayer = DetermineNextPlayer[this.options.pass](
      this.context.players,
      this.options.turnIndex,
    );

    if (nextPlayer) {
      this.changeState(
        new BuildFirstMinesState(this.context, this.events, this.changeState, {
          pass: nextPlayer.changePass ?? this.options.pass,
          turnIndex: nextPlayer.nextPlayerIndex,
        }),
      );
    } else {
      this.changeState(
        new ChooseFirstRoundBoostersState(
          this.context,
          this.events,
          this.changeState,
          this.context.players[this.context.players.length - 1],
        ),
      );
    }
  }

  toJSON(): SerializedState {
    return {
      type: GameState.BuildFirstMines,
      player: this.options.turnIndex,
      pass: this.options.pass,
    };
  }
}
