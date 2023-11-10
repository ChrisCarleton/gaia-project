import {
  EventArgs,
  EventType,
  Faction,
  Observer,
  Player,
  PlayerStructureData,
  PlayerStructures,
  PowerCycle,
  ResearchProgress,
  Resources,
  RoundBooster,
  ScoringTrackPositions,
  StructureType,
} from '..';
import { PowerCycleManager } from '../core/power-cycle-manager';
import { SerializedPlayer } from '../core/serialization';
import { PlayerStructureDataInstance } from './player-structure-data';

export abstract class PlayerBase implements Player {
  protected readonly events;

  readonly id: string;
  readonly faction: Faction;
  readonly powerCycleManager: PowerCycleManager;
  readonly research: ResearchProgress;
  readonly resources: Resources;
  readonly structuresMap: Record<StructureType, PlayerStructureData>;

  vp: number;
  roundBooster?: RoundBooster;
  scoringTrackPositionA: number;
  scoringTrackPositionB: number;
  hasPassed: boolean;

  constructor(id: string, faction: Faction, events: Observer) {
    this.id = id;
    this.faction = faction;
    this.events = events;

    this.powerCycleManager = new PowerCycleManager(faction.startingPowerCycle);

    this.research = faction.startingResearch;
    this.resources = faction.startingResources;
    const structureCounts = faction.startingStructures;
    this.structuresMap = {
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
    this.vp = 10;
    this.hasPassed = false;

    events.subscribe(EventType.IncomeGained, this.onIncomeReceived.bind(this));
    events.subscribe(EventType.MineBuilt, this.onMineBuilt.bind(this));
    events.subscribe(
      EventType.ResearchCompleted,
      this.onResearchCompleted.bind(this),
    );
    events.subscribe(EventType.ResourcesSpent, this.onResourcesSpent);
    events.subscribe(
      EventType.RoundBoosterSelected,
      this.onRoundBoosterSelected.bind(this),
    );
    events.subscribe(EventType.VPAwarded, this.onVPAwarded.bind(this));
  }

  abstract name: string;

  get powerCycle(): Readonly<PowerCycle> {
    return this.powerCycleManager;
  }

  get structures(): Readonly<PlayerStructures> {
    return this.structuresMap;
  }

  get scoringTrackPositions(): Readonly<ScoringTrackPositions> {
    return {
      trackA: this.scoringTrackPositionA,
      trackB: this.scoringTrackPositionB,
    };
  }

  get passed(): boolean {
    return this.hasPassed;
  }

  toJSON(): SerializedPlayer {
    return {
      faction: this.faction.factionType,
      id: this.id,
      name: this.name,
      powerCycle: {
        gaia: this.powerCycle.gaia,
        l1: this.powerCycle.level1,
        l2: this.powerCycle.level2,
        l3: this.powerCycle.level3,
      },
      research: {
        ai: this.research.ai,
        economics: this.research.economics,
        gaia: this.research.gaia,
        navigation: this.research.navigation,
        science: this.research.science,
        terraforming: this.research.terraforming,
      },
      resources: {
        credits: this.resources.credits,
        knowledge: this.resources.knowledge,
        ore: this.resources.ore,
        qic: this.resources.qic,
      },
      vp: this.vp,
    };
  }

  private onIncomeReceived(e: EventArgs): void {
    if (e.type === EventType.IncomeGained && e.player.id === this.id) {
      this.resources.credits += e.income.credits ?? 0;
      this.resources.knowledge += e.income.knowledge ?? 0;
      this.resources.ore += e.income.ore ?? 0;
      this.resources.qic += e.income.qic ?? 0;

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
      this.powerCycleManager.totalUncharged < chargeNodes
    ) {
      this.powerCycleManager.addNodes(addNodes);
      this.powerCycleManager.chargeNodes(chargeNodes);
      return;
    }

    // Otherwise, charge nodes first to boost the odds that more level 2 nodes get charged to level 3.
    this.powerCycleManager.chargeNodes(chargeNodes ?? 0);
    this.powerCycleManager.addNodes(addNodes ?? 0);
  }

  private onResearchCompleted(e: EventArgs): void {
    if (e.type === EventType.ResearchCompleted && e.player.id === this.id) {
      this.research[e.area]++;
    }
  }

  private onResourcesSpent(e: EventArgs): void {
    if (e.type === EventType.ResourcesSpent && e.player.id === this.id) {
      this.resources.credits -= e.resources.credits ?? 0;
      this.resources.knowledge -= e.resources.knowledge ?? 0;
      this.resources.ore -= e.resources.ore ?? 0;
      this.resources.qic -= e.resources.qic ?? 0;
    }
  }

  private onRoundBoosterSelected(e: EventArgs): void {
    if (e.type === EventType.RoundBoosterSelected && e.player.id === this.id) {
      this.roundBooster = e.roundBooster;
    }
  }

  private onVPAwarded(e: EventArgs): void {
    if (e.type === EventType.VPAwarded && e.player.id === this.id) {
      this.vp += e.vp;
    }
  }

  private onMineBuilt(e: EventArgs): void {
    if (e.type === EventType.MineBuilt && e.player.id === this.id) {
      this.structuresMap[StructureType.Mine].place(e.location.location);
    }
  }
}
