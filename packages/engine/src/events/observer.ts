import { EventArgs, EventType } from './event-args';

export type EventHandler = (e: EventArgs) => void | Promise<void>;

type Subscriptions = Partial<Record<EventType, EventHandler[]>>;

export class Observer {
  private subscriptions: Subscriptions;

  constructor() {
    this.subscriptions = {};
  }

  subscribe(eventType: EventType, handler: EventHandler) {
    if (!this.subscriptions[eventType]) {
      this.subscriptions[eventType] = [];
    }

    this.subscriptions[eventType]!.push(handler);
  }

  unsubscribe(eventType: EventType, handler: EventHandler) {
    const index = this.subscriptions[eventType]?.findIndex(
      (h) => h === handler,
    );

    if (typeof index === 'number' && index > -1) {
      this.subscriptions[eventType]?.splice(index, 1);
    }
  }

  publish(e: EventArgs) {
    this.subscriptions[e.type]?.forEach((subscriber) => {
      subscriber(e);
    });
  }

  reset(): void {
    this.subscriptions = {};
  }
}
