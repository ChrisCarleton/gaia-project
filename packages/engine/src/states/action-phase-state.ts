import { SerializedState } from '../core/serialization';
import { EventType, Observer } from '../events';
import {
  ChangeStateFunction,
  GameAction,
  GameContext,
  GameState,
  MapHex,
  Player,
  ResearchArea,
} from '../interfaces';
import { StateBase } from './state-base';

export class ActionPhaseState extends StateBase {
  constructor(
    context: GameContext,
    events: Observer,
    changeState: ChangeStateFunction,
    private readonly player: Player,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.ActionPhase;
  }

  init(): void {
    this.events.publish({
      type: EventType.AwaitingPlayerInput,
      allowedActions: [
        GameAction.BuildMine,
        GameAction.FormFederation,
        GameAction.Free,
        GameAction.GaiaProject,
        GameAction.Pass,
        GameAction.PowerOrQic,
        GameAction.Research,
        GameAction.Special,
        GameAction.UpgradeStructure,
      ],
      gameState: this.currentState,
      player: this.player,
    });
  }

  advanceResearch(area: ResearchArea): void {
    /*
      TODO: Validate move.
        1. Player must have 4 knowledge available.
        2. If advancing to level 5 in a given track additional rules apply:
          a. Only one player may occupy level 5 in each of the research tracks.
          b. Player must have an unactivated federation token available.
    */
    /*
      TODO: Perform action.
        1. Player pays 4 knowledge.
        2. Player advances in selected research area.
        3. If advancing to level 3, the player charges 3 power nodes.
        4. If advancing to level 5:
          a. Player must choose a federation token to activate.
          b. Player may have to choose location of lost planet.
        5. Player gains any one-time bonuses awarded by the research level.
    */
  }

  buildMine(location: MapHex): void {
    /*
      TODO: Validate move.
        1. Player must have a mine available in their supply.
        2. Selected hex must have an uninhabited planet.
          a. Exception: Lantids can build mines on other player's planets - they don't pay terraforming costs.
        3. Planet must be within range of one of the player's other planets. TODO: Create a utility function to calculate range.
          a. Base range is determined by the player's progress on the Navigation research track.
          b. Base range can be extended by 2 by spending a QIC.
        4. Planet must be habitable (or it must be capable of being made habitable by terraforming).
          a. Gaia planets can be made habitable by spending 1 QIC (instead of normal cost)
          b. Transdim planets that have been converted to Gaia planets and still have a Gaiaformer in orbit can have mines built on them for the normal cost.
        5. Player must have 1 ore and 2 credits to spend + any additional terraforming costs.
    */
    /*
      TODO:
        1. Player pays resources.
        2. Gaiaformer is returned (if Gaia project).
        3. Mine is placed and event is published.
        4. Player gains 2 knowledge if all of these conditions are met:
          a. Player is playing as Lantids
          b. They have built their planetary institute
          c. The new mine that was just built was built on a planet occupied by another player,
    */
    // TODO: Next action!
  }

  startGaiaProject(location: MapHex): void {
    /*
    TODO: Validate move.
      1. Player must have an available Gaiaformer.
      2. Player must have access to a transdim planet.
        a. An unclaimed transdim planet must be within range of one of the player's other planets.
        b. Players can activate QICs to extend their range.
      3. Player must have enough power nodes available. (See Gaiaforming research track.)
    */
    /*
    TODO: Perform action.
      1. Power nodes are moved to the Gaia area of the power cycle.
      2. Any QICs used to extend range are used up.
      3. Gaiaformer is placed on the trandim planet.
    */
  }

  toJSON(): SerializedState {
    return {
      type: GameState.ActionPhase,
      player: this.context.players.findIndex(
        (player) => player.id === this.player.id,
      ),
    };
  }
}
