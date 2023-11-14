import {
  ChangeStateFunction,
  EventType,
  GameContext,
  GameState,
  Income,
  ObserverPublisher,
  RoundBoosterBonusType,
  StructureType,
} from '..';
import { SerializedState } from '../core/serialization';
import { reduceIncome } from '../utils';
import { GaiaPhaseState } from './gaia-phase-state';
import { StateBase } from './state-base';

export class IncomePhaseState extends StateBase {
  constructor(
    context: GameContext,
    events: ObserverPublisher,
    changeState: ChangeStateFunction,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.IncomePhase;
  }

  init(): void {
    // Income phase is the start of a new round.
    this.events.publish({
      type: EventType.BeginRound,
      round: this.context.currentRound + 1,
    });

    this.context.players.forEach((player) => {
      const income: Income[] = [];

      /*
        Perform income calculations for each player.
          * ✅ Income from structures (TODO: remember to check for acadamy income when we get there)
          * ✅ Income from round booster
          * ✅ Income from research
          * Income from tech tiles
      */

      // Income from research.
      const { economics, science } = player.research;

      switch (economics) {
        case 1:
          income.push({
            chargePower: 1,
            credits: 2,
          });
          break;

        case 2:
          income.push({
            chargePower: 2,
            credits: 2,
            ore: 1,
          });
          break;

        case 3:
          income.push({
            chargePower: 3,
            credits: 3,
            ore: 1,
          });
          break;

        case 4:
          income.push({
            chargePower: 4,
            credits: 4,
            ore: 2,
          });
          break;
      }

      if (science > 0 && science < 5) {
        income.push({ knowledge: science });
      }

      // Income from structures.
      const factionIncome = player.faction.income;
      const mine =
        factionIncome[StructureType.Mine][player.structures.mine.active];
      const tradingStation =
        factionIncome[StructureType.TradingStation][
          player.structures.tradingStation.active
        ];
      const researchLab =
        factionIncome[StructureType.ResearchLab][
          player.structures.researchLab.active
        ];
      const planetaryInstitute =
        factionIncome[StructureType.PlanetaryInstitute][
          player.structures.planetaryInstitute.active
        ];
      // TODO: Check for acadamy income.
      income.push(mine, tradingStation, researchLab, planetaryInstitute);

      // Round booster income.
      if (player.roundBooster) {
        const { a, b } = player.roundBooster;

        if (a.type === RoundBoosterBonusType.Income) {
          income.push(a.income);
        }

        if (b.type === RoundBoosterBonusType.Income) {
          income.push(b.income);
        }
      }

      const calculatedIncome = reduceIncome(...income);
      this.events.publish({
        type: EventType.IncomeGained,
        player,
        income: calculatedIncome,
      });
    });

    this.changeState(
      new GaiaPhaseState(this.context, this.events, this.changeState),
    );
  }

  toJSON(): SerializedState {
    return {
      type: GameState.IncomePhase,
    };
  }
}
