import {
  GameContext,
  Map,
  Player,
  ResearchBoard,
  Round,
  RoundBooster,
} from '../interfaces';

export class GameContextInstance implements GameContext {
  private _currentRound: number;
  private _players: Player[];
  private _rounds: Round[];
  private _researchBoard: ResearchBoard;

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
  }

  get players(): Player[] {
    return this._players;
  }

  get currentRound(): number {
    return this._currentRound;
  }

  get roundBoosters(): Readonly<RoundBooster[]> {
    return [];
  }

  get rounds(): Readonly<Round[]> {
    return this._rounds;
  }

  get researchBoard(): Readonly<ResearchBoard> {
    return this._researchBoard;
  }
}
