import { EventArgs, EventType } from './event-args';

export type EventHandler = (e: EventArgs) => void | Promise<void>;

export interface Observer {
  /**
   * Subscribes an event listener to an in-game event.
   * @param eventType Event type to subscribe to.
   * @param handler A callback to handle the event when the it is fired.
   */
  subscribe(eventType: EventType, handler: EventHandler): void;

  /**
   *
   * @param eventType The type of event to unsubscribe from.
   * @param handler The event handler to remove as a listener.
   */
  unsubscribe(eventType: EventType, handler: EventHandler): void;

  /**
   * Resets the observer by removing all subscribed event listeners.
   */
  reset(): void;
}

export interface ObserverPublisher extends Observer {
  /**
   * Publishes an event. It will be delivered to all listeners that are subscribed to that event type.
   * @param e The event to publish.
   */
  publish(e: EventArgs): void;
}
