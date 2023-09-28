import { FactionType } from '@gaia-project/api';

import {
  Observer,
  PlanetType,
  PowerCycle,
  ResearchProgress,
  Resources,
} from '..';
import { FactionBase } from './faction-base';

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
      ai: 0,
      gaia: 0,
      navigation: 1,
      terraforming: 0,
      science: 0,
      economics: 0,
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
