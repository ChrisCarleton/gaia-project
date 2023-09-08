import { FactionFactory, FactionType, Observer } from '../../../src';
import { Terrans } from '../../../src/factions/terrans';

describe('Faction factory', () => {
  let events: Observer;

  beforeEach(() => {
    events = new Observer();
  });

  it('Will create a new faction based on the type parameter', () => {
    const factory = new FactionFactory();
    const faction = factory.createFaction(FactionType.Terrans, events);
    expect(faction).toBeInstanceOf(Terrans);
  });

  it.todo('Test all the other factions once they exist.');
});
