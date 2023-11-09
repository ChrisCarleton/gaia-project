import { Observer } from '../events';
import {
  AcadamyBonus,
  AcadamyBonusType,
  Faction,
  FactionIncome,
  FactionType,
  FreeAction,
  PlanetType,
  PowerCycle,
  ResearchProgress,
  Resources,
  StructureType,
} from '../interfaces';
import {
  DefaultAcadamyBonuses,
  DefaultStructureIncome,
  DefaultStructures,
} from './faction-defaults';

export abstract class FactionBase implements Faction {
  protected events: Observer;

  constructor(events: Observer) {
    this.events = events;
  }

  abstract factionType: FactionType;
  abstract homeWorld: PlanetType;
  abstract startingResources: Readonly<Resources>;
  abstract startingResearch: Readonly<ResearchProgress>;
  abstract startingPowerCycle: Readonly<PowerCycle>;

  readonly income: Readonly<FactionIncome> = DefaultStructureIncome;

  get acadamyBonuses(): [Readonly<AcadamyBonus>, Readonly<AcadamyBonus>] {
    return DefaultAcadamyBonuses;
  }

  get startingStructures(): Readonly<Record<StructureType, number>> {
    return { ...DefaultStructures };
  }
}
