import { GameContext } from '../../src';
import { BasicMapModel } from '../../src/core/maps';
import { createTestPlayer } from './create-test-player';

export function createTestContext(data?: Partial<GameContext>): GameContext {
  const researchTrack = {
    mastered: false,
    advancedTechTile: {},
    standardTechTiles: [],
  };

  return {
    currentRound: data?.currentRound ?? 1,
    roundBoosters: data?.roundBoosters ?? [],
    players: data?.players ?? [createTestPlayer(), createTestPlayer()],
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
    rounds: data?.rounds ?? [],
    allowedActions: [],
    currentPlayer: data?.currentPlayer,
  };
}
