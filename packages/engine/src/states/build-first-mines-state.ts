import { GameContext, GameState, MapHex, Player, State } from '../interfaces';
import { ErrorCode, GPError } from '../engine/errors';
import { EventType } from '../events/event-args';
import { Observer } from '../events/observer';
import { StateBase } from './state-base';

export class BuildFirstMinesState extends StateBase {
  constructor(
    private readonly player: Player,
    context: GameContext,
    events: Observer,
    changeState: (nextState: State) => void,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.BuildFirstMines;
  }

  buildMine(location: MapHex): void {
    // Validate hex. Must be unoccupied and contain a planet matching the player's home world.
    if (!location.planet) {
      throw new GPError(
        ErrorCode.InvalidMinePlacement,
        'New mine must be built on a planet.',
      );
    }

    if (location.planet !== this.player.faction.homeWorld) {
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
      player: this.player,
      location,
    });

    // Set next state
    let turnNumber = this.context.players.findIndex((p) => p === this.player);
    if (turnNumber === -1) {
      throw new Error('Player was not found in the game turn order.');
    }

    turnNumber++;

    if (turnNumber < this.context.players.length) {
      this.changeState(
        new BuildFirstMinesState(
          this.context.players[turnNumber],
          this.context,
          this.events,
          this.changeState,
        ),
      );
    }
  }
}
