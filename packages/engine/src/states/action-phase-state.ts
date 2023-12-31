import { SerializedState } from '../core/serialization';
import { EventType, ObserverPublisher } from '../events';
import {
  ChangeStateFunction,
  FreeAction,
  GameAction,
  GameContext,
  GameState,
  MapHex,
  Player,
  ResearchArea,
  RoundBooster,
} from '../interfaces';
import {
  FreeActions,
  NextStateDetermination,
  PassAction,
  ResearchAction,
} from './action-phase';
import { FreeActionPhaseState } from './free-action-phase-state';
import { StateBase } from './state-base';

export class ActionPhaseState extends StateBase {
  constructor(
    context: GameContext,
    events: ObserverPublisher,
    changeState: ChangeStateFunction,
    readonly player: Player,
  ) {
    super(context, events, changeState);
  }

  private advanceToFreeActions(): void {
    this.changeState(
      new FreeActionPhaseState(
        this.context,
        this.events,
        this.changeState,
        this.player,
      ),
    );
  }

  private advanceGameState(): void {
    const nextState = NextStateDetermination.determineNextState(
      this.context,
      this.events,
      this.changeState,
    );
    this.changeState(nextState);
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
      gameContext: this.context,
    });
  }

  advanceResearch(area: ResearchArea): void {
    const action = new ResearchAction();
    action.research(this.context, this.player, this.events, area);
    this.advanceToFreeActions();
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
    this.advanceToFreeActions();
  }

  // Players may perform multiple free actions on their turn. They do not count as their one
  // primary action that they may take per turn.
  freeAction(action: FreeAction): void {
    FreeActions.performFreeAction(this.player, this.events, action);
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
    this.advanceToFreeActions();
  }

  pass(roundBooster?: RoundBooster): void {
    const action = new PassAction();
    action.pass(this.context, this.player, this.events, roundBooster);
    this.advanceGameState();
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
