import {
  EventArgs,
  EventType,
  Faction,
  Observer,
  Player,
  PlayerStructureData,
  PlayerStructures,
  PowerCycle,
  PowerCycleManager,
  ResearchProgress,
  Resources,
  RoundBooster,
  ScoringTrackPositions,
  StructureType,
} from '..';
import { PowerCycleManagerInstance } from '../core/power-cycle-manager';
import { PlayerStructureDataInstance } from './player-structure-data';

export abstract class PlayerBase implements Player {
  protected readonly _research: ResearchProgress;
  protected readonly _resources: Resources;
  protected readonly _structures: Record<StructureType, PlayerStructureData>;
  protected readonly _powerCycle: PowerCycleManager;
  protected _roundBooster?: RoundBooster;
  protected _vp: number;
  protected scoringTrackPositionA: number;
  protected scoringTrackPositionB: number;

  constructor(
    readonly faction: Faction,
    protected readonly events: Observer,
  ) {
    this._powerCycle = new PowerCycleManagerInstance(
      faction.startingPowerCycle,
    );
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

    events.subscribe(EventType.IncomeGained, this.onIncomeReceived);
    events.subscribe(EventType.ResourcesSpent, this.onResourcesSpent);
  }

  abstract name: string;

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

  private onIncomeReceived(e: EventArgs): void {
    if (e.player === this && e.type === EventType.IncomeGained) {
      this._resources.credits += e.income.credits ?? 0;
      this._resources.knowledge += e.income.knowledge ?? 0;
      this._resources.ore += e.income.ore ?? 0;
      this._resources.qic += e.income.qic ?? 0;

      this.handlePowerIncome(e.income.powerNodes, e.income.chargePower);
    }
  }

  // Be smart about power income so that charging nodes and adding new nodes is done
  // in an order that maximizes benefit to the player.
  private handlePowerIncome(addNodes?: number, chargeNodes?: number) {
    // If the player has fewer nodes than the number they may charge, then grant them
    // the extra nodes first to make better use of the charges.
    if (
      addNodes &&
      chargeNodes &&
      this._powerCycle.totalUncharged < chargeNodes
    ) {
      this._powerCycle.addNodes(addNodes);
      this._powerCycle.chargeNodes(chargeNodes);
      return;
    }

    // Otherwise, charge nodes first to boost the odds that more level 2 nodes get charged to level 3.
    this._powerCycle.chargeNodes(chargeNodes ?? 0);
    this._powerCycle.addNodes(addNodes ?? 0);
  }

  private onResourcesSpent(e: EventArgs): void {
    if (e.player === this && e.type === EventType.ResourcesSpent) {
      this._resources.credits -= e.resources.credits ?? 0;
      this._resources.knowledge -= e.resources.knowledge ?? 0;
      this._resources.ore -= e.resources.ore ?? 0;
      this._resources.qic -= e.resources.qic ?? 0;
    }
  }
}
