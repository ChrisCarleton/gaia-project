import { Observer } from '../events/observer';
import { Faction } from '../interfaces';
import { PlayerBase } from './player-base';

export class HumanPlayer extends PlayerBase {
  private _name: string;

  constructor(id: string, name: string, faction: Faction, events: Observer) {
    super(id, faction, events);
    this._name = name;
  }

  get name(): string {
    return this.name;
  }
  set name(val: string) {
    this._name = val;
  }
}
