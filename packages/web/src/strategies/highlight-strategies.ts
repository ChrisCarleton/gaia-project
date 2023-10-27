import { HexHighlightStatus } from '@/graphics/map';
import { MapHex, Player } from '@gaia-project/engine';

import { HighlightStrategy, PlayerViewState } from './interfaces';

class GenericHighlightStrategy implements HighlightStrategy {
  determineHighlight(): HexHighlightStatus {
    return HexHighlightStatus.Neutral;
  }
}

class BuildFirstMinesHighlightStrategy implements HighlightStrategy {
  determineHighlight(player: Player, mapHex: MapHex): HexHighlightStatus {
    if (mapHex.planet) {
      // Planet must match the user's homeworld
      if (mapHex.planet.type !== player.faction.homeWorld) {
        return HexHighlightStatus.Bad;
      }

      // Planet cannot be occupied or have a structure built on it.
      if (mapHex.planet.player || mapHex.planet.structure) {
        return HexHighlightStatus.Bad;
      }

      return HexHighlightStatus.Good;
    }

    return HexHighlightStatus.Neutral;
  }
}

const genericStrategy = new GenericHighlightStrategy();

export const HighlightStrategies: Record<PlayerViewState, HighlightStrategy> = {
  [PlayerViewState.BuildFirstMine]: new BuildFirstMinesHighlightStrategy(),
  [PlayerViewState.Players]: genericStrategy,
} as const;
