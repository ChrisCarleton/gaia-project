import { v4 as uuid } from 'uuid';

import {
  Faction,
  FactionIncome,
  FactionType,
  Player,
  PlayerStructureData,
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
  passed: boolean;
  powerCycle: Partial<PowerCycle>;
  roundBooster: RoundBooster;
  research: Partial<ResearchProgress>;
  resources: Partial<Resources>;
  structureIncome: Partial<FactionIncome>;
  structures: Partial<Record<StructureType, PlayerStructureData | number>>;
  vp: number;
};

function generateStructureData(
  data: PlayerStructureData | number | undefined,
  defaultAvailable: number,
): PlayerStructureData {
  if (data === undefined) {
    return {
      active: 0,
      available: defaultAvailable,
      locations: [],
    };
  }

  if (typeof data === 'number') {
    return {
      active: data,
      available: defaultAvailable,
      locations: [],
    };
  }

  return data;
}

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
    academy: generateStructureData(options?.structures?.academy, 2),
    gaiaformer: generateStructureData(options?.structures?.gaiaformer, 0),
    mine: generateStructureData(options?.structures?.mine, 8),
    planetaryInstitute: generateStructureData(
      options?.structures?.planetaryInstitute,
      1,
    ),
    researchLab: generateStructureData(options?.structures?.researchLab, 3),
    tradingStation: generateStructureData(
      options?.structures?.tradingStation,
      4,
    ),
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
    passed: options?.passed ?? false,

    toJSON(): SerializedPlayer {
      return {} as SerializedPlayer;
    },
  };
}
