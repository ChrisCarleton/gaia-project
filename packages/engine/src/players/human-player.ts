import { Observer } from '../events/observer';
import { Faction } from '../interfaces';
import { PlayerBase } from './player-base';

export class HumanPlayer extends PlayerBase {
  private _name: string;

  constructor(name: string, faction: Faction, events: Observer) {
    super(faction, events);
    this._name = name;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
}
