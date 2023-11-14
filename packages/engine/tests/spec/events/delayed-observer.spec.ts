import {
  DelayedObserver,
  EventArgs,
  EventType,
  Observer,
  ObserverPublisher,
} from '../../../src/events';
import { TestObserver, createTestPlayer, nextTick } from '../../util';

describe('Delayed Observer', () => {
  let publisher: ObserverPublisher;
  let observer: Observer;

  beforeEach(() => {
    publisher = new TestObserver();
    observer = new DelayedObserver(publisher);
  });

  it('will echo events on a delay', async () => {
    const event: EventArgs = {
      type: EventType.BeginRound,
      round: 2,
    };
    let realTimeEvent: EventArgs | undefined;
    let delayedEvent: EventArgs | undefined;
    publisher.subscribe(EventType.BeginRound, (e) => {
      realTimeEvent = e;
    });
    observer.subscribe(EventType.BeginRound, (e) => {
      delayedEvent = e;
    });

    publisher.publish(event);
    expect(realTimeEvent).toEqual(event);
    expect(delayedEvent).toBeUndefined();

    await nextTick();

    expect(delayedEvent).toEqual(event);
  });

  it('will echo events to all subscribers', async () => {
    const event: EventArgs = {
      type: EventType.VPAwarded,
      message: 'Good job',
      player: createTestPlayer(),
      vp: 7,
    };

    const subscribers = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(EventType.VPAwarded, subscribers[0]);
    observer.subscribe(EventType.VPAwarded, subscribers[1]);
    observer.subscribe(EventType.VPAwarded, subscribers[2]);

    publisher.publish(event);
    await nextTick();

    expect(subscribers[0]).toBeCalledWith(event);
    expect(subscribers[1]).toBeCalledWith(event);
    expect(subscribers[2]).toBeCalledWith(event);
  });

  it('will allow subscribers to unsubscribe from events', async () => {
    const event: EventArgs = {
      type: EventType.VPAwarded,
      message: 'Good job',
      player: createTestPlayer(),
      vp: 7,
    };

    const subscribers = [jest.fn(), jest.fn(), jest.fn()];
    observer.subscribe(EventType.VPAwarded, subscribers[0]);
    observer.subscribe(EventType.VPAwarded, subscribers[1]);
    observer.subscribe(EventType.VPAwarded, subscribers[2]);
    observer.unsubscribe(EventType.VPAwarded, subscribers[1]);

    publisher.publish(event);
    await nextTick();

    expect(subscribers[0]).toBeCalledWith(event);
    expect(subscribers[1]).not.toBeCalledWith(event);
    expect(subscribers[2]).toBeCalledWith(event);
  });

  it('will ignore events published with no subscribers', async () => {
    const event: EventArgs = {
      type: EventType.IncomeGained,
      player: createTestPlayer(),
      income: { ore: 2 },
    };

    expect(() => publisher.publish(event)).not.toThrowError();
    await nextTick();
  });

  it('will fail silently if unsubscribe is called against a non-existent subscription', () => {
    const subscriber = jest.fn();
    observer.unsubscribe(EventType.ResearchCompleted, subscriber);
  });
});
