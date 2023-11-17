import {
  ErrorCode,
  EventType,
  FreeAction,
  GPError,
  Income,
  PowerCycle,
  Resources,
} from '../../../../src';
import { FreeActions } from '../../../../src/states/action-phase';
import { TestObserver, createTestPlayer } from '../../../util';

const ActionNames: Record<FreeAction, string> = {
  [FreeAction.GenerateCredit]: 'spend 1 power to generate 1 credit',
  [FreeAction.GenerateKnowledge]: 'spend 4 power to generate 1 knowledge',
  [FreeAction.GenerateOre]: 'spend 3 power to generate 1 ore',
  [FreeAction.GenerateQIC]: 'spend 4 power to generate 1 QIC',
  [FreeAction.TradeKnowledgeForCredit]: 'trade 1 knowledge for 1 credit',
  [FreeAction.TradeOreForCredit]: 'trade 1 ore for 1 credit',
  [FreeAction.TradeOreForPowerNode]: 'trade 1 ore for 1 power node',
  [FreeAction.TradeQICForOre]: 'trade 1 QIC for 1 ore',
} as const;

describe('Free Actions', () => {
  let events: TestObserver;

  beforeEach(() => {
    events = new TestObserver();
  });

  const ValidationTests: Record<
    FreeAction,
    {
      resources: Partial<Resources>;
      powerCycle: Partial<PowerCycle>;
      expectedError: ErrorCode;
    }
  > = {
    [FreeAction.GenerateCredit]: {
      resources: {},
      powerCycle: {},
      expectedError: ErrorCode.InsufficientPower,
    },
    [FreeAction.GenerateKnowledge]: {
      resources: {},
      powerCycle: { level3: 3 },
      expectedError: ErrorCode.InsufficientPower,
    },
    [FreeAction.GenerateOre]: {
      resources: {},
      powerCycle: { level3: 2 },
      expectedError: ErrorCode.InsufficientPower,
    },
    [FreeAction.GenerateQIC]: {
      resources: {},
      powerCycle: { level3: 3 },
      expectedError: ErrorCode.InsufficientPower,
    },
    [FreeAction.TradeKnowledgeForCredit]: {
      resources: {},
      powerCycle: {},
      expectedError: ErrorCode.InsufficientKnowledge,
    },
    [FreeAction.TradeOreForCredit]: {
      resources: {},
      powerCycle: {},
      expectedError: ErrorCode.InsufficientOre,
    },
    [FreeAction.TradeOreForPowerNode]: {
      resources: {},
      powerCycle: {},
      expectedError: ErrorCode.InsufficientOre,
    },
    [FreeAction.TradeQICForOre]: {
      resources: {},
      powerCycle: {},
      expectedError: ErrorCode.InsufficientQICs,
    },
  };
  Object.entries(ValidationTests).forEach(
    ([action, { powerCycle, resources, expectedError }]) => {
      it(`will fail validation if player has insufficient resources to ${
        ActionNames[action as FreeAction]
      }`, () => {
        try {
          const player = createTestPlayer({ powerCycle, resources });
          FreeActions.performFreeAction(player, events, action as FreeAction);
          fail(`Expected an error with error code ${expectedError}`);
        } catch (error) {
          expect(error).toBeInstanceOf(GPError);
          expect((error as GPError).code).toBe(expectedError);
        }

        expect(events.events).toHaveLength(0);
      });
    },
  );

  const ActionTests: Record<FreeAction, { cost: Income; value: Income }> = {
    [FreeAction.GenerateCredit]: {
      cost: { powerCharge: 1 },
      value: { credits: 1 },
    },
    [FreeAction.GenerateKnowledge]: {
      cost: { powerCharge: 4 },
      value: { knowledge: 1 },
    },
    [FreeAction.GenerateOre]: {
      cost: { powerCharge: 3 },
      value: { ore: 1 },
    },
    [FreeAction.GenerateQIC]: {
      cost: { powerCharge: 4 },
      value: { qic: 1 },
    },
    [FreeAction.TradeKnowledgeForCredit]: {
      cost: { knowledge: 1 },
      value: { credits: 1 },
    },
    [FreeAction.TradeOreForCredit]: {
      cost: { ore: 1 },
      value: { credits: 1 },
    },
    [FreeAction.TradeOreForPowerNode]: {
      cost: { ore: 1 },
      value: { powerNodes: 1 },
    },
    [FreeAction.TradeQICForOre]: {
      cost: { qic: 1 },
      value: { ore: 1 },
    },
  };
  Object.entries(ActionTests).forEach(([action, { cost, value }]) => {
    it(`will perform free action: ${ActionNames[action as FreeAction]}`, () => {
      const player = createTestPlayer({
        powerCycle: { level3: 99 },
        resources: {
          credits: 99,
          ore: 99,
          knowledge: 99,
          qic: 99,
        },
      });

      FreeActions.performFreeAction(player, events, action as FreeAction);

      expect(events.events).toEqual([
        {
          type: EventType.ResourcesSpent,
          player,
          resources: cost,
        },
        {
          type: EventType.IncomeGained,
          player,
          income: value,
        },
      ]);
    });
  });
});
