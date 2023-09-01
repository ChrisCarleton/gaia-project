import { EventArgs, EventType } from "./events"
import { GameContext } from "./game-context";

export type EventHandler = (e: EventArgs, ctx: GameContext) => void | Promise<void>;

type Subscriptions = Partial<Record<EventType, EventHandler[]>>;

export class Observer {
  private readonly subscriptions: Subscriptions = {};

  subscribe(eventType: EventType, handler: EventHandler) {}

  publish(e: EventArgs) {}
}
