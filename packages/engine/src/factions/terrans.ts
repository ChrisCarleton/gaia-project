import { Observer } from '../events';
import {
  FactionType,
  PlanetType,
  PowerCycle,
  ResearchProgress,
  Resources,
  StructureType,
} from '../interfaces';
import { FactionBase } from './faction-base';
import { DefaultStartingResearch } from './faction-defaults';

export class Terrans extends FactionBase {
  constructor(events: Observer) {
    super(events);
  }

  get factionType(): FactionType {
    return FactionType.Terrans;
  }

  get homeWorld(): PlanetType {
    return PlanetType.Terra;
  }

  get startingPowerCycle(): Readonly<PowerCycle> {
    return {
      level1: 4,
      level2: 4,
      level3: 0,
      gaia: 0,
    };
  }

  get startingResearch(): Readonly<ResearchProgress> {
    return {
      ...DefaultStartingResearch,
      gaia: 1,
    };
  }

  get startingResources(): Readonly<Resources> {
    return {
      credits: 15,
      ore: 4,
      knowledge: 3,
      qic: 1,
    };
  }

  get startingStructures(): Readonly<Record<StructureType, number>> {
    return {
      ...super.startingStructures,
      gaiaformer: 1,
    };
  }
}
