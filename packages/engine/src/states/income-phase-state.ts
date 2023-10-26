import {
  ChangeStateFunction,
  EventType,
  GameContext,
  GameState,
  Income,
  Observer,
  RoundBoosterBonusType,
} from '..';
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
          * Income from structures
          * Income from round booster
          * Income from research
          * Income from tech tiles
      */

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

      this.events.publish({
        type: EventType.IncomeGained,
        player,
        income: income.reduce(this.reduceIncome),
      });
    });

    // TODO: Change state.
  }

  private reduceIncome(total: Income, currrentValue: Income): Income {
    return {
      ...{
        chargePower: this.addResource(
          total.chargePower,
          currrentValue.chargePower,
        ),
        credits: this.addResource(total.credits, currrentValue.credits),
        knowledge: this.addResource(total.knowledge, currrentValue.knowledge),
        ore: this.addResource(total.ore, currrentValue.ore),
        powerNodes: this.addResource(
          total.powerNodes,
          currrentValue.powerNodes,
        ),
        qic: this.addResource(total.qic, currrentValue.qic),
      },
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
}
