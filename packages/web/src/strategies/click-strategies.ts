import { Game, MapHex, Player } from '@gaia-project/engine';

import { ClickStrategy, PlayerViewState } from './interfaces';

class GenericClickStrategy implements ClickStrategy {
  async handleClick(): Promise<void> {
    /* No-op... for now. */
  }
}

class BuildFirstMineClickStrategy implements ClickStrategy {
  async handleClick(game: Game, player: Player, mapHex: MapHex): Promise<void> {
    game.buildMine(mapHex);
  }
}

export const ClickStrategies: Record<PlayerViewState, ClickStrategy> = {
  [PlayerViewState.Players]: new GenericClickStrategy(),
  [PlayerViewState.BuildFirstMine]: new BuildFirstMineClickStrategy(),
} as const;
