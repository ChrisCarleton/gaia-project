import {
  GameAction,
  GameContext,
  Map,
  Player,
  ResearchBoard,
  Round,
  RoundBooster,
} from '../interfaces';

export class DefaultGameContext implements GameContext {
  private readonly _map: Map;

  private _players: Player[];
  private _rounds: Round[];
  private _researchBoard: ResearchBoard;
  private _roundBoosters: RoundBooster[];

  allowedActions: Readonly<GameAction[]> = [];
  currentPlayer: Player | undefined;
  currentRound: number;

  constructor(map: Map, players: Player[]) {
    const researchTrack = {
      mastered: false,
      advancedTechTile: {},
      standardTechTiles: [],
    };
    this._map = map;
    this._players = players;
    this.currentRound = 1;
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

  get map(): Map {
    return this._map;
  }
}
