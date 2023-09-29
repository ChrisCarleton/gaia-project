import { FactionType } from '..';
import { FactionFactory, Observer, Player } from '..';
import { AIPlayer } from './ai-player';
import { HumanPlayer } from './human-player';

export class PlayerFactory {
  constructor(
    private readonly events: Observer,
    private readonly factionFactory: FactionFactory,
  ) {}

  createPlayer(faction: FactionType, name: string): Player {
    const factionEntity = this.factionFactory.createFaction(
      faction,
      this.events,
    );
    return new HumanPlayer(name, factionEntity, this.events);
  }

  createAIOpponent(faction: FactionType): Player {
    const factionEntity = this.factionFactory.createFaction(
      faction,
      this.events,
    );
    return new AIPlayer(factionEntity, this.events);
  }
}
