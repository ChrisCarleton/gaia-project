import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { Player } from '../../../src';
import {
  EventArgs,
  EventType,
  LocalObserver,
  ObserverPublisher,
} from '../../../src/events';

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
  let observer: ObserverPublisher;

  beforeEach(() => {
    observer = new LocalObserver();
  });

  it('will respond to publish requests even if no listeners are subscribed', () => {
    expect(() => observer.publish(TestEvents[1])).not.toThrowError();
  });

  it('will will send events to a listener', () => {
    const listener = jest.fn();
    observer.subscribe(TestEvents[0].type, listener);
    observer.publish(TestEvents[0]);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(TestEvents[0]);
  });

  it('will will broadcast events to multiple listeners', () => {
    const listeners = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(TestEvents[1].type, listeners[0]);
    observer.subscribe(TestEvents[1].type, listeners[1]);
    observer.subscribe(TestEvents[1].type, listeners[2]);

    observer.publish(TestEvents[1]);

    listeners.forEach((listener) => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(TestEvents[1]);
    });
  });

  it('will unsubscribe a listener', () => {
    const listeners = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(TestEvents[0].type, listeners[0]);
    observer.subscribe(TestEvents[0].type, listeners[1]);
    observer.subscribe(TestEvents[0].type, listeners[2]);
    observer.unsubscribe(TestEvents[0].type, listeners[1]);

    observer.publish(TestEvents[0]);

    expect(listeners[0]).toHaveBeenCalledTimes(1);
    expect(listeners[0]).toHaveBeenCalledWith(TestEvents[0]);
    expect(listeners[2]).toHaveBeenCalledTimes(1);
    expect(listeners[2]).toHaveBeenCalledWith(TestEvents[0]);
    expect(listeners[1]).not.toHaveBeenCalled();
  });

  it('will not transmit events to listeners of the wrong type', () => {
    const listener = jest.fn();
    observer.subscribe(EventType.StructureBuilt, listener);
    observer.publish(TestEvents[1]);
    expect(listener).not.toHaveBeenCalled();
  });

  it('will do nothing if unsubscribe is called against a non-existent listener', () => {
    const otherListener = jest.fn();
    const listener = jest.fn();
    observer.subscribe(TestEvents[0].type, otherListener);
    observer.unsubscribe(TestEvents[0].type, listener);
    observer.publish(TestEvents[0]);

    expect(otherListener).toHaveBeenCalledWith(TestEvents[0]);
  });
});
