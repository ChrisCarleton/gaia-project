import { v4 as uuid } from 'uuid';

import {
  Faction,
  FactionIncome,
  FactionType,
  Player,
  PlayerStructures,
  PowerCycle,
  ResearchProgress,
  Resources,
  RoundBooster,
  StructureType,
} from '../../src';
import { SerializedPlayer } from '../../src/core/serialization';
import { FactionHomeWorlds } from '../../src/factions';
import {
  DefaultAcadamyBonuses,
  DefaultStartingResearch,
  DefaultStructureIncome,
  DefaultStructures,
} from '../../src/factions/faction-defaults';

type TestPlayerOptions = {
  faction: FactionType;
  id: string;
  name: string;
  powerCycle: Partial<PowerCycle>;
  roundBooster: RoundBooster;
  research: Partial<ResearchProgress>;
  resources: Partial<Resources>;
  structureIncome: Partial<FactionIncome>;
  structures: Partial<Record<StructureType, number>>;
  vp: number;
};

export function createTestPlayer(options?: Partial<TestPlayerOptions>): Player {
  const factionType = options?.faction ?? FactionType.Terrans;
  const faction: Faction = {
    factionType,
    homeWorld: FactionHomeWorlds[factionType],
    income: {
      ...DefaultStructureIncome,
      ...options?.structureIncome,
    },
    acadamyBonuses: DefaultAcadamyBonuses,
    startingPowerCycle: {
      level1: 0,
      level2: 0,
      level3: 0,
      gaia: 0,
    },
    startingResearch: DefaultStartingResearch,
    startingResources: {
      credits: 0,
      knowledge: 0,
      ore: 0,
      qic: 0,
    },
    startingStructures: DefaultStructures,
  };

  const structures: PlayerStructures = {
    academy: {
      active: options?.structures?.academy ?? 0,
      available: 2,
      locations: [],
    },
    gaiaformer: {
      active: options?.structures?.gaiaformer ?? 0,
      available: 0,
      locations: [],
    },
    mine: {
      active: options?.structures?.mine ?? 0,
      available: 8,
      locations: [],
    },
    planetaryInstitute: {
      active: options?.structures?.planetaryInstitute ?? 0,
      available: 1,
      locations: [],
    },
    researchLab: {
      active: options?.structures?.researchLab ?? 0,
      available: 3,
      locations: [],
    },
    satellite: {
      active: options?.structures?.satellite ?? 0,
      available: 25,
      locations: [],
    },
    tradingStation: {
      active: options?.structures?.tradingStation ?? 0,
      available: 4,
      locations: [],
    },
  };
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
    roundBooster: options?.roundBooster,
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
    structures,
    vp: options?.vp ?? 0,
    passed: false,

    toJSON(): SerializedPlayer {
      return {} as SerializedPlayer;
    },
  };
}
