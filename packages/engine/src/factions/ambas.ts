import { Observer } from '../events';
import {
  FactionType,
  PlanetType,
  PowerCycle,
  ResearchProgress,
  Resources,
} from '../interfaces';
import { FactionBase } from './faction-base';
import { DefaultStartingResearch } from './faction-defaults';

export class Ambas extends FactionBase {
  constructor(events: Observer) {
    super(events);
  }

  get factionType(): FactionType {
    return FactionType.Ambas;
  }

  get homeWorld(): PlanetType {
    return PlanetType.Swamp;
  }

  get startingPowerCycle(): Readonly<PowerCycle> {
    return {
      level1: 2,
      level2: 4,
      level3: 0,
      gaia: 0,
    };
  }

  get startingResearch(): Readonly<ResearchProgress> {
    return {
      ...DefaultStartingResearch,
      navigation: 1,
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
}
