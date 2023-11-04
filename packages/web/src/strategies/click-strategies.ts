import { Game, MapHex, Player } from '@gaia-project/engine';

import { ClickStrategy, MenuPanelState } from './interfaces';

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

export const ClickStrategies: Record<MenuPanelState, ClickStrategy> = {
  [MenuPanelState.Players]: new GenericClickStrategy(),
  [MenuPanelState.BuildFirstMine]: new BuildFirstMineClickStrategy(),
} as const;
