import { HexHighlightStatus } from '@/graphics/map';
import { Game, MapHex, Player } from '@gaia-project/engine';

export enum PlayerViewState {
  Players,
  BuildFirstMine,
}

export interface HighlightStrategy {
  determineHighlight(player: Player, mapHex: MapHex): HexHighlightStatus;
}

export interface ClickStrategy {
  handleClick(game: Game, player: Player, mapHex: MapHex): Promise<void>;
}
