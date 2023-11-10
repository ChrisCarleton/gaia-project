import { EventArgs, EventType, Faction, Observer } from '..';
import { PlayerBase } from './player-base';

export class AIPlayer extends PlayerBase {
  private _name = 'beep-boop';

  constructor(id: string, faction: Faction, events: Observer) {
    super(id, faction, events);
    events.subscribe(
      EventType.AwaitingPlayerInput,
      this.onAwaitingAction.bind(this),
    );
  }

  get name(): string {
    // TODO: Generate a name or something.
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  private onAwaitingAction(e: EventArgs) {
    if (e.type === EventType.AwaitingPlayerInput) {
      setTimeout(() => {
        // TODO: AI will need to respond to this event with an action.
      }, 1);
    }
  }
}
