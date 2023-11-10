import {
  EventArgs,
  EventHandler,
  EventType,
  LocalObserver,
  ObserverPublisher,
} from '../../src/events';

/** Wraps an internal LocalObserver and logs all of the events that are published for inspection. */
export class TestObserver implements ObserverPublisher {
  private _internalObserver: ObserverPublisher;
  private _events: EventArgs[];

  constructor(internalObserver?: ObserverPublisher) {
    this._internalObserver = internalObserver ?? new LocalObserver();
    this._events = [];
  }

  subscribe(eventType: EventType, handler: EventHandler): void {
    this._internalObserver.subscribe(eventType, handler);
  }

  unsubscribe(eventType: EventType, handler: EventHandler): void {
    this._internalObserver.unsubscribe(eventType, handler);
  }

  publish(e: EventArgs): void {
    this._events.push(e);
    this._internalObserver.publish(e);
  }

  reset(): void {
    this._events = [];
  }

  get events(): Readonly<EventArgs[]> {
    return this._events;
  }
}
