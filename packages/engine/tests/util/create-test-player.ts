import { mockDeep } from 'jest-mock-extended';
import { v4 as uuid } from 'uuid';

import {
  Faction,
  FactionHomeWorlds,
  FactionType,
  Player,
  PlayerStructures,
  PowerCycle,
  ResearchProgress,
  Resources,
} from '../../src';
import { SerializedPlayer } from '../../src/core/serialization';

type TestPlayerOptions = {
  faction: FactionType;
  id: string;
  name: string;
  powerCycle: Partial<PowerCycle>;
  research: Partial<ResearchProgress>;
  resources: Partial<Resources>;
  vp: number;
};

export function createTestPlayer(options?: Partial<TestPlayerOptions>): Player {
  const factionType = options?.faction ?? FactionType.Terrans;
  const faction = mockDeep<Faction>({
    factionType,
    homeWorld: FactionHomeWorlds[factionType],
  });

  return {
    id: options?.id ?? uuid(),
    faction,
    name: options?.name ?? 'Testy McTesterson',
    powerCycle: {
      level1: 0,
      level2: 0,
      level3: 0,
      gaia: 0,
      ...options?.powerCycle,
    },
    research: {
      ai: 0,
      economics: 0,
      gaia: 0,
      navigation: 0,
      science: 0,
      terraforming: 0,
      ...options?.research,
    },
    resources: {
      credits: 0,
      knowledge: 0,
      ore: 0,
      qic: 0,
      ...options?.resources,
    },
    scoringTrackPositions: {
      trackA: 0,
      trackB: 0,
    },
    structures: mockDeep<PlayerStructures>(),
    vp: options?.vp ?? 0,

    toJSON(): SerializedPlayer {
      return mockDeep<SerializedPlayer>();
    },
  };
}
