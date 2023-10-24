import { Faction, Observer, Player } from '../../src';
import { Terrans } from '../../src/factions/terrans';
import { PlayerBase } from '../../src/players/player-base';

export type TestPlayerOptions = {
  id: string;
  name: string;
  faction: Faction;
  events: Observer;
};

export class TestPlayer extends PlayerBase {
  name: string;

  constructor(options: Partial<TestPlayerOptions> = {}) {
    const { id, name, faction, events } = options;
    const e = events ?? new Observer();
    super(id ?? '', faction ?? new Terrans(e), e);
    this.name = name ?? 'Testy McTesterson III';
  }
}

export function createTestPlayer(options?: Partial<TestPlayerOptions>): Player {
  return new TestPlayer(options);
}
