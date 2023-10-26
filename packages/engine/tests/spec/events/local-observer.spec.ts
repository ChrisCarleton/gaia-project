import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { MapHex, Player } from '../../../src';
import {
  EventArgs,
  EventType,
  LocalObserver,
  Observer,
} from '../../../src/events';

describe('Observer class', () => {
  const player: DeepMockProxy<Player> = mockDeep<Player>();
  const e: EventArgs = {
    type: EventType.IncomeGained,
    player,
    income: {
      ore: 2,
    },
  };
  let observer: Observer;

  beforeEach(() => {
    observer = new LocalObserver();
  });

  it('will respond to publish requests even if no listeners are subscribed', () => {
    expect(() => observer.publish(e)).not.toThrowError();
  });

  it('will will send events to a listener', () => {
    const listener = jest.fn();
    observer.subscribe(e.type, listener);
    observer.publish(e);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(e);
  });

  it('will will broadcast events to multiple listeners', () => {
    const listeners = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(e.type, listeners[0]);
    observer.subscribe(e.type, listeners[1]);
    observer.subscribe(e.type, listeners[2]);
    observer.publish(e);

    listeners.forEach((listener) => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(e);
    });
  });

  it('will unsubscribe a listener', () => {
    const listeners = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(e.type, listeners[0]);
    observer.subscribe(e.type, listeners[1]);
    observer.subscribe(e.type, listeners[2]);
    observer.unsubscribe(e.type, listeners[1]);

    observer.publish(e);

    expect(listeners[0]).toHaveBeenCalledTimes(1);
    expect(listeners[0]).toHaveBeenCalledWith(e);
    expect(listeners[2]).toHaveBeenCalledTimes(1);
    expect(listeners[2]).toHaveBeenCalledWith(e);
    expect(listeners[1]).not.toHaveBeenCalled();
  });

  it('will not transmit events to listeners of the wrong type', () => {
    const listener = jest.fn();
    observer.subscribe(EventType.StructureBuilt, listener);
    observer.publish(e);
    expect(listener).not.toHaveBeenCalled();
  });

  it('will do nothing if unsubscribe is called against a non-existent listener', () => {
    const otherListener = jest.fn();
    const listener = jest.fn();
    observer.subscribe(e.type, otherListener);
    observer.unsubscribe(e.type, listener);
    observer.publish(e);
    expect(otherListener).toHaveBeenCalledWith(e);
  });

  it('will reset and remove all observers', () => {
    const listeners = [jest.fn(), jest.fn()];
    observer.subscribe(EventType.MineBuilt, listeners[0]);
    observer.subscribe(e.type, listeners[1]);

    observer.reset();

    observer.publish(e);
    observer.publish({
      type: EventType.MineBuilt,
      location: mockDeep<MapHex>(),
      player,
    });

    expect(listeners[0]).not.toHaveBeenCalled();
    expect(listeners[1]).not.toHaveBeenCalled();
  });
});
