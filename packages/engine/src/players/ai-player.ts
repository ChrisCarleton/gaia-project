import { Faction, Observer } from '..';
import { PlayerBase } from './player-base';

export class AIPlayer extends PlayerBase {
  private _name = 'beep-boop';

  constructor(id: string, faction: Faction, events: Observer) {
    super(id, faction, events);
  }

  get name(): string {
    // TODO: Generate a name or something.
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  // TODO: Hook into AwaitingAction event and use some machine-learning magic.
}
