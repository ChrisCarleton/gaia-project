import { Faction, FactionType } from '../interfaces';
import { Observer } from '../events/observer';
import { Terrans } from './terrans';

export class FactionFactory {
  // TODO: Remove "Partial" once everything is implemented.
  private static readonly FactionMap: Partial<
    Record<FactionType, (events: Observer) => Faction>
  > = {
    [FactionType.Terrans]: (e) => new Terrans(e),
  };

  createFaction(type: FactionType, events: Observer): Faction {
    const faction = FactionFactory.FactionMap[type];

    if (!faction) {
      throw new Error('Faction not created yet.');
    }

    return faction(events);
  }
}
