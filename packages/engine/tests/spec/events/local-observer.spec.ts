import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { MapHex, Player } from '../../../src';
import {
  EventArgs,
  EventType,
  LocalObserver,
  Observer,
} from '../../../src/events';

function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('Observer class', () => {
  const player: DeepMockProxy<Player> = mockDeep<Player>();
  const TestEvents: EventArgs[] = [
    {
      type: EventType.IncomeGained,
      player,
      income: {
        ore: 2,
      },
    },
    {
      type: EventType.VPAwarded,
      player,
      vp: 12,
      message: 'Good job!',
    },
  ];
  let observer: Observer;

  beforeEach(() => {
    observer = new LocalObserver();
  });

  it('will respond to publish requests even if no listeners are subscribed', () => {
    expect(() => observer.publish(TestEvents[1])).not.toThrowError();
  });

  it('will will send events to a listener', async () => {
    const listener = jest.fn();
    observer.subscribe(TestEvents[0].type, listener);
    observer.publish(TestEvents[0]);
    await nextTick();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(TestEvents[0]);
  });

  it('will will broadcast events to multiple listeners', async () => {
    const listeners = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(TestEvents[1].type, listeners[0]);
    observer.subscribe(TestEvents[1].type, listeners[1]);
    observer.subscribe(TestEvents[1].type, listeners[2]);

    observer.publish(TestEvents[1]);
    await nextTick();

    listeners.forEach((listener) => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(TestEvents[1]);
    });
  });

  it('will unsubscribe a listener', async () => {
    const listeners = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(TestEvents[0].type, listeners[0]);
    observer.subscribe(TestEvents[0].type, listeners[1]);
    observer.subscribe(TestEvents[0].type, listeners[2]);
    observer.unsubscribe(TestEvents[0].type, listeners[1]);

    observer.publish(TestEvents[0]);
    await nextTick();

    expect(listeners[0]).toHaveBeenCalledTimes(1);
    expect(listeners[0]).toHaveBeenCalledWith(TestEvents[0]);
    expect(listeners[2]).toHaveBeenCalledTimes(1);
    expect(listeners[2]).toHaveBeenCalledWith(TestEvents[0]);
    expect(listeners[1]).not.toHaveBeenCalled();
  });

  it('will not transmit events to listeners of the wrong type', async () => {
    const listener = jest.fn();
    observer.subscribe(EventType.StructureBuilt, listener);
    observer.publish(TestEvents[1]);
    await nextTick();
    expect(listener).not.toHaveBeenCalled();
  });

  it('will do nothing if unsubscribe is called against a non-existent listener', async () => {
    const otherListener = jest.fn();
    const listener = jest.fn();
    observer.subscribe(TestEvents[0].type, otherListener);
    observer.unsubscribe(TestEvents[0].type, listener);
    observer.publish(TestEvents[0]);

    await nextTick();

    expect(otherListener).toHaveBeenCalledWith(TestEvents[0]);
  });

  it('will reset and remove all observers', async () => {
    const listeners = [jest.fn(), jest.fn()];
    observer.subscribe(EventType.MineBuilt, listeners[0]);
    observer.subscribe(TestEvents[0].type, listeners[1]);

    observer.reset();

    observer.publish(TestEvents[0]);
    observer.publish({
      type: EventType.MineBuilt,
      location: mockDeep<MapHex>(),
      player,
    });

    await nextTick();

    expect(listeners[0]).not.toHaveBeenCalled();
    expect(listeners[1]).not.toHaveBeenCalled();
  });
});
