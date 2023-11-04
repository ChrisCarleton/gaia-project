import {
  ChangeStateFunction,
  EventType,
  GameContext,
  GameState,
  Income,
  Observer,
  RoundBoosterBonusType,
  StructureType,
} from '..';
import { SerializedState } from '../core/serialization';
import { GaiaPhaseState } from './gaia-phase-state';
import { StateBase } from './state-base';

export class IncomePhaseState extends StateBase {
  constructor(
    context: GameContext,
    events: Observer,
    changeState: ChangeStateFunction,
  ) {
    super(context, events, changeState);
  }

  get currentState(): GameState {
    return GameState.IncomePhase;
  }

  init(): void {
    this.context.players.forEach((player) => {
      const income: Income[] = [];

      /*
        TODO: Perform income calculations for each player.
          * ✅ Income from structures (remember to check for acadamy income when we get there)
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
      income.push(
        factionIncome[StructureType.Mine][player.structures.mine.active],
        factionIncome[StructureType.TradingStation][
          player.structures.tradingStation.active
        ],
        factionIncome[StructureType.ResearchLab][
          player.structures.researchLab.active
        ],
        factionIncome[StructureType.PlanetaryInstitute][
          player.structures.planetaryInstitute.active
        ],
      );
      // TODO: Check for acadamy income.

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

      const calculatedIncome = income.reduce(this.reduceIncome.bind(this));
      this.events.publish({
        type: EventType.IncomeGained,
        player,
        income: { ...calculatedIncome },
      });
    });

    // TODO: Change state.
    this.changeState(
      new GaiaPhaseState(this.context, this.events, this.changeState),
    );
  }

  private reduceIncome(total: Income, currrentValue: Income): Income {
    return {
      chargePower: this.addResource(
        total.chargePower,
        currrentValue.chargePower,
      ),
      credits: this.addResource(total.credits, currrentValue.credits),
      knowledge: this.addResource(total.knowledge, currrentValue.knowledge),
      ore: this.addResource(total.ore, currrentValue.ore),
      powerNodes: this.addResource(total.powerNodes, currrentValue.powerNodes),
      qic: this.addResource(total.qic, currrentValue.qic),
    };
  }

  private addResource(
    currentValue: number | undefined,
    addition: number | undefined,
  ): number | undefined {
    if (addition) {
      return currentValue ? currentValue + addition : addition;
    }

    return currentValue;
  }

  toJSON(): SerializedState {
    return {
      type: GameState.IncomePhase,
    };
  }
}
