import { EventArgs, EventType } from './event-args';
import { EventHandler, ObserverPublisher } from './observer';

type Subscriptions = Partial<Record<EventType, EventHandler[]>>;

/** Local Event Observer to be used internally in the game engine. */
export class LocalObserver implements ObserverPublisher {
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
    const index =
      this.subscriptions[eventType]?.findIndex((h) => h === handler) ?? -1;

    if (index > -1) {
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
