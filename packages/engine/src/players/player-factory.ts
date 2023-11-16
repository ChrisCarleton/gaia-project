import { SerializedGameContext, SerializedPlayer } from '../core/serialization';
import { Observer } from '../events';
import { Factions } from '../factions';
import { FactionType, Player } from '../interfaces';
import { AIPlayer } from './ai-player';
import { HumanPlayer } from './human-player';

export class PlayerFactory {
  constructor(private readonly events: Observer) {}

  createPlayer(id: string, faction: FactionType, name: string): Player {
    return new HumanPlayer(id, name, Factions[faction], this.events);
  }

  createAIOpponent(id: string, faction: FactionType): Player {
    return new AIPlayer(id, Factions[faction], this.events);
  }

  deserializePlayer(
    playerData: SerializedPlayer,
    gameData: SerializedGameContext,
  ): Player {
    const player = new HumanPlayer(
      playerData.id,
      playerData.name,
      Factions[playerData.faction],
      this.events,
    );

    player.powerCycleManager.setValues({
      gaia: playerData.powerCycle.gaia,
      level1: playerData.powerCycle.level1,
      level2: playerData.powerCycle.level2,
      level3: playerData.powerCycle.level3,
    });

    player.research.ai = playerData.research.ai;
    player.research.economics = playerData.research.economics;
    player.research.gaia = playerData.research.gaia;
    player.research.navigation = playerData.research.navigation;
    player.research.science = playerData.research.science;
    player.research.terraforming = playerData.research.terraforming;

    player.resources.credits = playerData.resources.credits;
    player.resources.knowledge = playerData.resources.knowledge;
    player.resources.ore = playerData.resources.ore;
    player.resources.qic = playerData.resources.qic;

    player.roundBooster = playerData.roundBooster;

    player.vp = playerData.vp;

    // Scan the map to place the player's structures.
    // TODO: Deserialize Lanid mines and Ivits space stations.
    const playerIndex = gameData.players.findIndex((p) => p.id === player.id);
    for (const hex of gameData.map) {
      if (
        hex.planet &&
        hex.planet.structure &&
        hex.planet.player === playerIndex
      ) {
        const { q, r } = hex.location;
        player.structuresMap[hex.planet.structure].place([q, r]);
      }
    }

    return player;
  }
}
