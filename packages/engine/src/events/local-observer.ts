import { EventArgs, EventType } from './event-args';
import { EventHandler, Observer } from './observer';

type Subscriptions = Partial<Record<EventType, EventHandler[]>>;

export class LocalObserver implements Observer {
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
      setTimeout(() => subscriber(e), 0);
    });
  }

  reset(): void {
    this.subscriptions = {};
  }
}
