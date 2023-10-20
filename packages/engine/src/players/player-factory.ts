import { FactionType } from '..';
import { FactionFactory, Observer, Player } from '..';
import { AIPlayer } from './ai-player';
import { HumanPlayer } from './human-player';

export class PlayerFactory {
  constructor(
    private readonly events: Observer,
    private readonly factionFactory: FactionFactory,
  ) {}

  createPlayer(id: string, faction: FactionType, name: string): Player {
    const factionEntity = this.factionFactory.createFaction(
      faction,
      this.events,
    );
    return new HumanPlayer(id, name, factionEntity, this.events);
  }

  createAIOpponent(id: string, faction: FactionType): Player {
    const factionEntity = this.factionFactory.createFaction(
      faction,
      this.events,
    );
    return new AIPlayer(id, factionEntity, this.events);
  }
}
