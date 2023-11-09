import { EventArgs, Observer } from '../../src/events';

export class TestObserver implements Observer {
  private _events: EventArgs[];

  constructor() {
    this._events = [];
  }

  subscribe(): void {}
  unsubscribe(): void {}

  publish(e: EventArgs): void {
    this._events.push(e);
  }

  reset(): void {
    this._events = [];
  }

  get events(): Readonly<EventArgs[]> {
    return this._events;
  }
}
