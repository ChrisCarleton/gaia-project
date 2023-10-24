import { z } from 'zod';

import {
  GameAction,
  GameContext,
  Map,
  Player,
  ResearchBoard,
  Round,
  RoundBooster,
} from '../interfaces';

export const GameContextSchema = z.object({});
export type SerializedGameContext = z.infer<typeof GameContextSchema>;

export class GameContextInstance implements GameContext {
  private _currentRound: number;
  private _players: Player[];
  private _rounds: Round[];
  private _researchBoard: ResearchBoard;
  private _roundBoosters: RoundBooster[];

  private _currentPlayer: Player | undefined;
  private _allowedActions: Readonly<GameAction[]> = [];

  constructor(
    readonly map: Map,
    players: Player[],
  ) {
    const researchTrack = {
      mastered: false,
      advancedTechTile: {},
      standardTechTiles: [],
    };
    this._players = players;
    this._currentRound = 1;
    this._rounds = [];
    this._researchBoard = {
      terraformingFederationToken: {},
      researchTracks: {
        ai: { ...researchTrack },
        navigation: { ...researchTrack },
        gaia: { ...researchTrack },
        economics: { ...researchTrack },
        science: { ...researchTrack },
        terraforming: { ...researchTrack },
      },
    };
    this._roundBoosters = [];
  }

  get players(): Player[] {
    return this._players;
  }

  get currentRound(): number {
    return this._currentRound;
  }

  get roundBoosters(): RoundBooster[] {
    return this._roundBoosters;
  }
  set roundBoosters(val: RoundBooster[]) {
    this._roundBoosters = val;
  }

  get rounds(): Readonly<Round[]> {
    return this._rounds;
  }

  get researchBoard(): Readonly<ResearchBoard> {
    return this._researchBoard;
  }

  get currentPlayer(): Player | undefined {
    return this._currentPlayer;
  }
  set currentPlayer(val: Player | undefined) {
    this._currentPlayer = val;
  }

  get allowedActions(): Readonly<GameAction[]> {
    return this._allowedActions;
  }
  set allowedActions(val: Readonly<GameAction[]>) {
    this._allowedActions = val;
  }

  toJSON(): Record<string, unknown> {
    // TODO: Serialize!
    return {};
  }
}
