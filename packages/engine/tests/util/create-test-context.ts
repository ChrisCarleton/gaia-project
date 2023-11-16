import { GameContext, RoundScoringBonus } from '../../src';
import { BasicMapModel } from '../../src/maps';
import { createTestPlayer } from './create-test-player';

export function createTestContext(data?: Partial<GameContext>): GameContext {
  const researchTrack = {
    mastered: false,
    advancedTechTile: {},
    standardTechTiles: [],
  };

  const players = data?.players ?? [createTestPlayer(), createTestPlayer()];

  return {
    currentRound: data?.currentRound ?? 1,
    roundBoosters: data?.roundBoosters ?? [],
    players,
    map: data?.map ?? new BasicMapModel().createMap(2),
    researchBoard: data?.researchBoard ?? {
      terraformingFederationToken: {},
      researchTracks: {
        ai: { ...researchTrack },
        navigation: { ...researchTrack },
        gaia: { ...researchTrack },
        economics: { ...researchTrack },
        science: { ...researchTrack },
        terraforming: { ...researchTrack },
      },
    },
    roundScoringBonuses:
      data?.roundScoringBonuses ?? Object.values(RoundScoringBonus).slice(0, 6),
    allowedActions: [],
    currentPlayer: data?.currentPlayer ?? players[0],
    passOrder: [],
  };
}
