import { Faction, Observer } from '..';
import { Ambas } from './ambas';
import { BalTAks } from './bal-t-aks';
import { FactionType } from './faction-type';
import { Terrans } from './terrans';

export class FactionFactory {
  // TODO: Remove "Partial" once everything is implemented.
  private static readonly FactionMap: Partial<
    Record<FactionType, (events: Observer) => Faction>
  > = {
    [FactionType.Ambas]: (e) => new Ambas(e),
    [FactionType.BalTaks]: (e) => new BalTAks(e),
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
