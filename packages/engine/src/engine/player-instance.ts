import {
  Faction,
  Player,
  PlayerStructureData,
  PlayerStructures,
  PowerCycle,
  ResearchProgress,
  Resources,
  RoundBooster,
  ScoringTrackPositions,
  StructureType,
} from '../interfaces';
import { EventArgs, EventType } from '../events/event-args';
import { Observer } from '../events/observer';
import { PlayerStructureDataInstance } from './player-structure-data';

export class PlayerInstance implements Player {
  private readonly _research: ResearchProgress;
  private readonly _resources: Resources;
  private readonly _structures: Record<StructureType, PlayerStructureData>;
  private readonly _powerCycle: PowerCycle;
  private _roundBooster?: RoundBooster;
  private _vp: number;
  private scoringTrackPositionA: number;
  private scoringTrackPositionB: number;

  constructor(
    readonly name: string,
    readonly faction: Faction,
    events: Observer,
  ) {
    this._powerCycle = faction.startingPowerCycle;
    this._research = faction.startingResearch;
    this._resources = faction.startingResources;
    const structureCounts = faction.startingStructures;
    this._structures = {
      [StructureType.Academy]: new PlayerStructureDataInstance(
        structureCounts.academy,
      ),
      [StructureType.Gaiaformer]: new PlayerStructureDataInstance(
        structureCounts.gaiaformer,
      ),
      [StructureType.Mine]: new PlayerStructureDataInstance(
        structureCounts.mine,
      ),
      [StructureType.PlanetaryInstitute]: new PlayerStructureDataInstance(
        structureCounts.planetaryInstitute,
      ),
      [StructureType.ResearchLab]: new PlayerStructureDataInstance(
        structureCounts.researchLab,
      ),
      [StructureType.Satellite]: new PlayerStructureDataInstance(
        structureCounts.satellite,
      ),
      [StructureType.TradingStation]: new PlayerStructureDataInstance(
        structureCounts.tradingStation,
      ),
    };

    this.scoringTrackPositionA = 0;
    this.scoringTrackPositionB = 0;
    this._vp = 10;

    events.subscribe(EventType.ResourcesGained, this.onResourcesChanged);
    events.subscribe(EventType.ResourcesSpent, this.onResourcesChanged);
  }

  get powerCycle(): Readonly<PowerCycle> {
    return this._powerCycle;
  }

  get research(): Readonly<ResearchProgress> {
    return this._research;
  }

  get resources(): Readonly<Resources> {
    return this._resources;
  }

  get structures(): Readonly<PlayerStructures> {
    return this._structures;
  }

  get roundBooster(): RoundBooster | undefined {
    return this._roundBooster;
  }

  get scoringTrackPositions(): Readonly<ScoringTrackPositions> {
    return {
      trackA: this.scoringTrackPositionA,
      trackB: this.scoringTrackPositionB,
    };
  }

  get vp(): number {
    return this._vp;
  }

  private onResourcesChanged(e: EventArgs): void {
    if (e.player !== this) return;

    if (e.type === EventType.ResourcesGained) {
      this._resources.credits += e.resources.credits ?? 0;
      this._resources.knowledge += e.resources.knowledge ?? 0;
      this._resources.ore += e.resources.ore ?? 0;
      this._resources.qic += e.resources.qic ?? 0;
    } else if (e.type === EventType.ResourcesSpent) {
      this._resources.credits -= e.resources.credits ?? 0;
      this._resources.knowledge -= e.resources.knowledge ?? 0;
      this._resources.ore -= e.resources.ore ?? 0;
      this._resources.qic -= e.resources.qic ?? 0;
    }
  }
}
