import {
  Faction,
  FactionType,
  PlanetType,
  PlayerStructures,
  PowerCycle,
  ResearchProgress,
  Resources,
  StructureType,
} from '../interfaces';
import { Observer } from '../events/observer';

const DefaultStructures: Record<StructureType, number> = {
  [StructureType.Academy]: 2,
  [StructureType.Gaiaformer]: 0,
  [StructureType.Mine]: 8,
  [StructureType.PlanetaryInstitute]: 1,
  [StructureType.ResearchLab]: 3,
  [StructureType.Satellite]: 25,
  [StructureType.TradingStation]: 4,
};

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

  get startingStructures(): Readonly<Record<StructureType, number>> {
    return { ...DefaultStructures };
  }
}
