import { FactionType } from '@gaia-project/api';

import {
  Observer,
  PlanetType,
  PowerCycle,
  ResearchProgress,
  Resources,
  StructureType,
} from '..';
import { FactionBase } from './faction-base';

export class BalTAks extends FactionBase {
  constructor(events: Observer) {
    super(events);
  }

  get factionType(): FactionType {
    return FactionType.BalTaks;
  }

  get homeWorld(): PlanetType {
    return PlanetType.Volcanic;
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
      ai: 0,
      gaia: 1,
      navigation: 0,
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

  get startingStructures(): Readonly<Record<StructureType, number>> {
    return {
      ...super.startingStructures,
      gaiaformer: 1,
    };
  }
}
